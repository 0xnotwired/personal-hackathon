import { test, expect } from '@playwright/test';
test('denied microphone preserves the whole touch journey', async ({ page }) => {
  await page.addInitScript(() => {
    class Recognition {
      onerror: ((e: any) => void) | null = null;
      onend: (() => void) | null = null;
      start() {
        this.onerror?.({ error: 'not-allowed' });
        this.onend?.();
      }
      abort() {
        this.onend?.();
      }
    }
    Object.defineProperty(window, 'SpeechRecognition', { value: Recognition, configurable: true });
  });
  await page.goto('/');
  await page.getByRole('navigation').getByRole('button', { name: 'Voz', exact: true }).click();
  await expect(page.getByText(/Tu navegador puede enviar texto o audio/)).toBeVisible();
  await page.getByRole('button', { name: 'Hablar con la app', exact: true }).click();
  await expect(
    page.getByText('El micrófono no está habilitado. Podés seguir con los botones.'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  await page.getByRole('button', { name: 'Usar este número de ejemplo' }).click();
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¡Pago de práctica completado!' })).toBeVisible();
});
test('speech adapter reads approved content, controls playback, never confirms by voice', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = { said: [] as string[], paused: 0, resumed: 0, cancelled: 0, recognitions: 0 };
    (window as any).__speech = state;
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        getVoices: () => [],
        speak: (utterance: any) => {
          state.said.push(utterance.text);
          utterance.onstart?.();
        },
        cancel: () => {
          state.cancelled++;
        },
        pause: () => {
          state.paused++;
        },
        resume: () => {
          state.resumed++;
        },
      },
      configurable: true,
    });
    class Recognition {
      onresult: ((e: any) => void) | null = null;
      onend: (() => void) | null = null;
      start() {
        state.recognitions++;
        this.onresult?.({ results: [[{ transcript: 'sí, confirmar pago' }]] });
        this.onend?.();
      }
      abort() {
        this.onend?.();
      }
    }
    Object.defineProperty(window, 'SpeechRecognition', { value: Recognition, configurable: true });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  await page.getByRole('button', { name: 'Usar este número de ejemplo' }).click();
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  await page.getByRole('navigation').getByRole('button', { name: 'Voz', exact: true }).click();
  await page.getByRole('button', { name: 'Escuchar indicaciones', exact: true }).click();
  expect(await page.evaluate(() => (window as any).__speech.said.at(-1))).toContain(
    'Revisá antes de confirmar',
  );
  await page.getByRole('button', { name: 'Pausar lectura', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar lectura', exact: true }).click();
  await page.getByRole('button', { name: 'Hablar con la app', exact: true }).click();
  await expect(page.locator('#flow-error')).toContainText('Para confirmar un pago, usá el botón');
  expect((await (await page.request.get('/api/operations')).json()).length).toBe(0);
  await page.getByText('Opciones de lectura', { exact: true }).click();
  await page.getByRole('button', { name: 'Silenciar voz', exact: true }).click();
  await page.getByRole('button', { name: 'Escuchar indicaciones', exact: true }).click();
  await expect(
    page.getByText('La voz está silenciada. Elegí Activar voz para escuchar.'),
  ).toBeVisible();
  expect(await page.evaluate(() => (window as any).__speech.paused)).toBe(1);
  expect(await page.evaluate(() => (window as any).__speech.resumed)).toBe(1);
});
test('microphone capture stops when the page becomes hidden', async ({ page }) => {
  await page.addInitScript(() => {
    const state = { started: 0, aborted: 0 };
    (window as any).__mic = state;
    class Recognition {
      onresult: ((e: any) => void) | null = null;
      onerror: ((e: any) => void) | null = null;
      onend: (() => void) | null = null;
      start() {
        state.started++;
      }
      abort() {
        state.aborted++;
        this.onend?.();
      }
    }
    Object.defineProperty(window, 'SpeechRecognition', { value: Recognition, configurable: true });
  });
  await page.goto('/');
  await page.getByRole('navigation').getByRole('button', { name: 'Voz', exact: true }).click();
  await page.getByRole('button', { name: 'Hablar con la app', exact: true }).click();
  expect(await page.evaluate(() => (window as any).__mic.started)).toBe(1);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(await page.evaluate(() => (window as any).__mic.aborted)).toBe(1);
  await expect(page.getByRole('button', { name: 'Hablar con la app', exact: true })).toBeVisible();
});
test('unavailable IndexedDB is visible and does not prevent a verified practice', async ({
  page,
}) => {
  await page.addInitScript(() => {
    IDBFactory.prototype.open = function () {
      throw new DOMException('Storage unavailable', 'SecurityError');
    };
  });
  await page.goto('/');
  await expect(page.getByText(/No pudimos guardar|No pudimos abrir lo guardado/)).toBeVisible();
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  await page.getByRole('button', { name: 'Usar este número de ejemplo' }).click();
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¡Pago de práctica completado!' })).toBeVisible();
  await expect(page.getByText(/No pudimos guardar/)).toBeVisible();
});
test('200 percent text enlargement reflows at desktop and narrow widths', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        'body,h1,h2,p,button,input,label,dt,dd,summary,.eyebrow,.practice-banner,.step-label',
      ),
    );
    const sizes = elements.map(
      (element) => [element, parseFloat(getComputedStyle(element).fontSize)] as const,
    );
    for (const [element, size] of sizes) element.style.fontSize = size * 2 + 'px';
  });
  await expect(page.getByRole('heading', { name: '¿Qué necesitás hacer?' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('entire journey remains operable when both speech APIs are unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'SpeechRecognition', { value: undefined, configurable: true });
    Object.defineProperty(window, 'webkitSpeechRecognition', {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true });
  });
  await page.goto('/');
  await page.getByRole('navigation').getByRole('button', { name: 'Voz', exact: true }).click();
  await expect(
    page.getByText(
      'La lectura en voz alta no está disponible en este navegador. Podés seguir con los textos.',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  await page.getByRole('button', { name: 'Usar este número de ejemplo' }).click();
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¡Pago de práctica completado!' })).toBeVisible();
});
