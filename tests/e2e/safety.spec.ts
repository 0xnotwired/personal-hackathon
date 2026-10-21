import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('contextual help fills only a requested example, and safety analysis cannot confirm a payment', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  await page.getByRole('button', { name: '¿Qué hago?', exact: true }).click();
  await page.getByRole('button', { name: 'Mostrarme el próximo paso' }).click();
  await expect(page.getByRole('dialog')).toContainText('Lo escribimos en el casillero');
  await page.getByRole('button', { name: 'Usar un número de ejemplo en mi factura' }).click();
  await expect(page.getByLabel('Número de factura de práctica', { exact: true })).toHaveValue(
    '100200300',
  );
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  await page.getByRole('button', { name: 'Me están apurando para pagar', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByText('Probar con un mensaje de ejemplo', { exact: true }).click();
  await dialog.getByRole('button', { name: 'Ejemplo: me piden un código' }).click();
  await dialog.getByRole('button', { name: 'Revisar señales del mensaje' }).click();
  await expect(
    dialog.getByRole('heading', { name: 'Hay varias señales para revisar' }),
  ).toBeVisible();
  await expect(dialog.locator('blockquote').first()).toContainText('ahora mismo');
  await expect(dialog).toContainText('No prueban por sí solas que sea un engaño');
  expect((await (await page.request.get('/api/operations')).json()).length).toBe(0);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await dialog.getByText('Ver respuestas que puedo usar', { exact: true }).click();
  await expect(dialog.getByLabel('Respuesta: Poner un límite')).toHaveValue(
    /No voy a compartir claves ni códigos/,
  );
  await page.screenshot({ path: 'test-results/mobile-safety.png', fullPage: true });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Revisá antes de confirmar' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Me están apurando para pagar', exact: true }),
  ).toBeFocused();
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¡Pago de práctica completado!' })).toBeVisible();
});

test('no-match stays inconclusive, input is cleared on close and never stored', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Quiero revisar un mensaje que me pide pagar' }).click();
  const field = page.getByLabel('Mensaje que querés revisar');
  await field.fill('La factura vence el 10 de noviembre.');
  await page.getByRole('button', { name: 'Revisar señales del mensaje' }).click();
  await expect(
    page.getByRole('heading', { name: 'No hay un resultado concluyente' }),
  ).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText(
    'No encontrar señales no significa que sea seguro',
  );
  await field.fill('CAMBIO_PRIVADO_NO_GUARDAR');
  await expect(page.getByRole('heading', { name: 'No hay un resultado concluyente' })).toHaveCount(
    0,
  );
  await page.getByRole('button', { name: 'Volver a donde estaba' }).click();
  await page.getByRole('button', { name: 'Quiero revisar un mensaje que me pide pagar' }).click();
  await expect(field).toHaveValue('');
  await page.keyboard.press('Escape');
  const stored = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open('autonomia-practica');
      request.onsuccess = () => resolve(request.result);
    });
    return new Promise<string>((resolve) => {
      const request = db.transaction('state').objectStore('state').get('current');
      request.onsuccess = () => resolve(JSON.stringify(request.result));
    });
  });
  expect(stored).not.toContain('CAMBIO_PRIVADO_NO_GUARDAR');
});

test('desktop and mobile home remain usable', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '¿Qué necesitás hacer?' })).toBeVisible();
  await page.screenshot({ path: 'test-results/desktop-home.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'test-results/mobile-home.png', fullPage: true });
  const targets = await page.locator('button:visible,summary:visible').evaluateAll((elements) =>
    elements
      .map((e) => ({
        name: e.textContent?.trim(),
        width: e.getBoundingClientRect().width,
        height: e.getBoundingClientRect().height,
      }))
      .filter((x) => x.width < 44 || x.height < 44),
  );
  expect(targets).toEqual([]);
});
