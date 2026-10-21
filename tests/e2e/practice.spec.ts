import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function begin(page: Page, code = '100200300') {
  await page.goto('/');
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  await page.getByLabel('Número de factura de práctica', { exact: true }).fill(code);
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Revisá antes de confirmar' })).toBeVisible();
}
async function checkAxe(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
}

test('complete touch flow, review resume, verified receipt, download and history', async ({
  page,
}) => {
  await begin(page);
  await expect(page.getByText('Tu avance se guardó en este navegador.')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Revisá antes de confirmar' })).toBeVisible();
  await expect(page.locator('.receipt-visual strong')).toHaveText('$ 18.500,40');
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¡Pago de práctica completado!' })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Guardar comprobante de práctica', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('comprobante-de-practica.txt');
  await page.reload();
  await expect(page.getByRole('heading', { name: '¡Pago de práctica completado!' })).toBeVisible();
  await page.getByRole('button', { name: 'Volver al inicio', exact: true }).click();
  await page.getByRole('button', { name: 'Ayuda y opciones' }).click();
  await page.getByRole('button', { name: 'Ver mis prácticas anteriores' }).click();
  await expect(page.getByRole('button', { name: /Luz ·/ })).toHaveCount(1);
});
test('pending is not success; leaving preserves operation and cancellation is verified', async ({
  page,
}) => {
  await begin(page, '100200301');
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Tu pago de práctica está en revisión' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Volver al inicio', exact: true }).click();
  await page.getByRole('button', { name: 'Ayuda y opciones' }).click();
  await page.getByRole('button', { name: 'Ver mis prácticas anteriores' }).click();
  await page.getByRole('button', { name: /Luz ·/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Tu pago de práctica está en revisión' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Pedir cancelar este pago de práctica', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Sí, pedir cancelación', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Tu pago de práctica fue cancelado' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Tu pago de práctica fue cancelado' }),
  ).toBeVisible();
});
test('failed outcome stays failed and offers repeat', async ({ page }) => {
  await begin(page, '100200302');
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'El pago de práctica fue rechazado' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Volver a practicar', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¿Qué servicio querés pagar?' })).toBeVisible();
});
test('lost commit response recovers the existing result with no duplicate', async ({ page }) => {
  await begin(page);
  await page.route('**/api/operations', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fetch();
      await route.abort('failed');
    } else await route.continue();
  });
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Estamos consultando el resultado' }),
  ).toBeVisible();
  await expect(page.locator('#flow-error')).toContainText('Todavía no sabemos el resultado');
  await page.unroute('**/api/operations');
  await page.getByRole('button', { name: 'Consultar resultado', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¡Pago de práctica completado!' })).toBeVisible();
  const ops = await page.request.get('/api/operations');
  expect((await ops.json()).length).toBe(1);
});
test('failed-before-commit request allows deliberate review and safe retry', async ({ page }) => {
  await begin(page);
  await page.route('**/api/operations', (route) =>
    route.request().method() === 'POST' ? route.abort('failed') : route.continue(),
  );
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(page.locator('#flow-error')).toBeVisible();
  await page.unroute('**/api/operations');
  await page.getByRole('button', { name: 'Consultar resultado', exact: true }).click();
  await page
    .getByRole('button', { name: 'Volver a revisar la misma factura', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: 'Revisá antes de confirmar' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¡Pago de práctica completado!' })).toBeVisible();
});
test('repeated input, held Enter, and double confirmation cannot bypass review or duplicate', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  const field = page.getByLabel('Número de factura de práctica', { exact: true });
  await field.fill('100200300');
  await field.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Busquemos tu factura de práctica' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).dblclick();
  await expect(page.getByRole('heading', { name: 'Revisá antes de confirmar' })).toBeVisible();
  await page.keyboard.down('Enter');
  await page.waitForTimeout(1000);
  await page.keyboard.up('Enter');
  expect((await (await page.request.get('/api/operations')).json()).length).toBe(0);
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).dblclick();
  await expect(page.getByRole('heading', { name: '¡Pago de práctica completado!' })).toBeVisible();
  expect((await (await page.request.get('/api/operations')).json()).length).toBe(1);
});
test('keyboard-only payment and axe on all main steps at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '¿Qué necesitás hacer?' })).toBeVisible();
  await checkAxe(page);
  // Actual Tab sequence; headings receive focus on step changes.
  async function tabTo(name: string) {
    for (let i = 0; i < 35; i++) {
      await page.keyboard.press('Tab');
      const label = await page.evaluate(() => document.activeElement?.textContent?.trim());
      if (label === name) return;
    }
    throw new Error('Could not tab to ' + name);
  }
  await tabTo('Quiero practicar');
  await page.keyboard.press('Enter');
  await checkAxe(page);
  await tabTo('Seguir con luz');
  await page.keyboard.press('Enter');
  await checkAxe(page);
  await tabTo('Usar este número de ejemplo');
  await page.keyboard.press('Enter');
  await tabTo('Buscar factura');
  await page.keyboard.press('Enter');
  await checkAxe(page);
  await page.waitForTimeout(950);
  await tabTo('Confirmar pago de práctica');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: '¡Pago de práctica completado!' })).toBeVisible();
  await checkAxe(page);
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390);
  await page.screenshot({ path: 'test-results/mobile-result.png', fullPage: true });
});
test('session isolation, origin and strict request contracts at actual HTTP boundary', async ({
  page,
  browser,
}) => {
  await begin(page);
  const review = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open('autonomia-practica');
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    return new Promise<any>((resolve) => {
      const r = db.transaction('state').objectStore('state').get('current');
      r.onsuccess = () => resolve(r.result.draft.review);
    });
  });
  const cross = await browser.newContext();
  const response = await cross.request.post('http://localhost:3000/api/operations', {
    headers: { Origin: 'http://localhost:3000' },
    data: { reviewId: review.id, key: review.key, confirmed: true },
  });
  expect(response.status()).toBe(401);
  await cross.close();
  const evil = await page.request.post('/api/operations', {
    headers: { Origin: 'https://elsewhere.example' },
    data: { reviewId: review.id, key: review.key, confirmed: true },
  });
  expect(evil.status()).toBe(400);
  const tlsTerminated = await page.request.post('/api/reviews', {
    headers: { Origin: 'https://localhost:3000' },
    data: {
      draftId: crypto.randomUUID(),
      key: crypto.randomUUID(),
      service: 'luz',
      code: '100200300',
    },
  });
  expect(tlsTerminated.status()).toBe(200);
  const tamper = await page.request.post('/api/operations', {
    headers: { Origin: 'http://localhost:3000' },
    data: { reviewId: review.id, key: review.key, confirmed: true, amount: 1 },
  });
  expect(tamper.status()).toBe(400);
  const large = await page.request.post('/api/operations', {
    headers: { Origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
    data: JSON.stringify({ junk: 'a'.repeat(5000) }),
  });
  expect(large.status()).toBe(400);
  const valid = () =>
    page.request.post('/api/operations', {
      headers: { Origin: 'http://localhost:3000' },
      data: { reviewId: review.id, key: review.key, confirmed: true },
    });
  const answers = await Promise.all([valid(), valid(), valid()]);
  const ops = await Promise.all(answers.map((r) => r.json()));
  expect(new Set(ops.map((o) => o.id)).size).toBe(1);
  const other = await browser.newContext();
  const hidden = await other.request.get('http://localhost:3000/api/operations/' + ops[0].id);
  expect(hidden.status()).toBe(404);
  await other.close();
});
test('favorites and bill fields persist; unknown bill offers correction', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ayuda y opciones' }).click();
  await page.getByRole('button', { name: 'Guardar Pagar una factura en favoritos' }).click();
  await expect(
    page.getByRole('button', { name: 'Quitar Pagar una factura en favoritos' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await expect(page.getByText('Tu avance se guardó en este navegador.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Tu avance se guardó en este navegador.')).toBeVisible();
  await page.getByRole('button', { name: 'Ayuda y opciones' }).click();
  await expect(
    page.getByRole('button', { name: 'Quitar Pagar una factura en favoritos' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  const codeField = page.getByLabel('Número de factura de práctica', { exact: true });
  await codeField.fill('100 200 300');
  await expect(codeField).toHaveValue('100200300');
  await codeField.fill('000200300');
  await expect(codeField).toHaveValue('000200300');
  await codeField.fill('123456789');
  await expect(page.getByText('Tu avance se guardó en este navegador.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Número de factura de práctica', { exact: true })).toHaveValue(
    '123456789',
  );
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  await expect(page.locator('#flow-error')).toContainText('Usá uno de los números de ejemplo');
  await page.getByRole('button', { name: 'Usar este número de ejemplo' }).click();
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Revisá antes de confirmar' })).toBeVisible();
});
