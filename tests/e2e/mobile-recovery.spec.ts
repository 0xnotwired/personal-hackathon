import { test, expect } from '@playwright/test';

test('mobile service selection persists and back navigation retains the entered bill', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('radio', { name: 'Gas', exact: true }).check();
  await expect(page.getByText('Tu avance se guardó en este navegador.')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('radio', { name: 'Gas', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Seguir con gas', exact: true }).click();
  await page.getByLabel('Número de factura de práctica', { exact: true }).fill('200300300');
  await page.getByRole('button', { name: 'Volver al paso anterior', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con gas', exact: true }).click();
  await expect(page.getByLabel('Número de factura de práctica', { exact: true })).toHaveValue(
    '200300300',
  );
});
test('lost cancellation response remains uncertain until a verified lookup', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  await page.getByLabel('Número de factura de práctica', { exact: true }).fill('100200301');
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await page.route('**/api/operations/*/cancel', async (route) => {
    await route.fetch();
    await route.abort('failed');
  });
  await page
    .getByRole('button', { name: 'Pedir cancelar este pago de práctica', exact: true })
    .click();
  await page.getByRole('button', { name: 'Sí, pedir cancelación', exact: true }).click();
  await expect(page.locator('#flow-error')).toContainText('No pudimos confirmar la cancelación');
  await expect(
    page.getByRole('heading', { name: 'Tu pago de práctica está en revisión' }),
  ).toBeVisible();
  await page.unroute('**/api/operations/*/cancel');
  await page.getByRole('button', { name: 'Consultar resultado', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Tu pago de práctica fue cancelado' }),
  ).toBeVisible();
});
test('review restores server-owned amount even when IndexedDB has a changed display amount', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  await page.getByRole('button', { name: 'Usar este número de ejemplo' }).click();
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  await expect(page.getByText('Tu avance se guardó en este navegador.')).toBeVisible();
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const r = indexedDB.open('autonomia-practica');
      r.onsuccess = () => resolve(r.result);
    });
    await new Promise<void>((resolve) => {
      const tx = db.transaction('state', 'readwrite');
      const store = tx.objectStore('state');
      const r = store.get('current');
      r.onsuccess = () => {
        const saved = r.result;
        saved.draft.review.bill.amount = 1;
        store.put(saved);
      };
      tx.oncomplete = () => resolve();
    });
  });
  await page.reload();
  await expect(page.getByText('$ 18.500,40', { exact: true })).toBeVisible();
  await expect(page.getByText('$ 0,01', { exact: true })).toHaveCount(0);
});
test('mobile navigation and standalone manifest work without an account', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Navegación principal' });
  await expect(nav).toBeVisible();
  await nav.getByRole('button', { name: 'Ayuda', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar ayuda', exact: true }).click();
  await nav.getByRole('button', { name: 'Voz', exact: true }).click();
  await expect(page.locator('#voice-controls')).toBeVisible();
  await nav.getByRole('button', { name: 'Inicio', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¿Qué necesitás hacer?' })).toBeVisible();
  const manifest = await (await page.request.get('/manifest.webmanifest')).json();
  expect(manifest.display).toBe('standalone');
  expect(manifest.theme_color).toBe('#005dbb');
  for (const icon of manifest.icons) {
    const response = await page.request.get(icon.src);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
  }
});

test('corrupt saved draft stays preserved until the person explicitly starts again', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByText('Tu avance se guardó en este navegador.')).toBeVisible();
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const r = indexedDB.open('autonomia-practica');
      r.onsuccess = () => resolve(r.result);
    });
    await new Promise<void>((resolve) => {
      const tx = db.transaction('state', 'readwrite');
      tx.objectStore('state').put({
        id: 'current',
        draft: { version: 999 },
        preferences: { favorite: false, rate: 0.85, muted: false },
      });
      tx.oncomplete = () => resolve();
    });
  });
  await page.reload();
  await expect(page.getByText(/No pudimos recuperar el avance guardado/)).toBeVisible();
  const version = () =>
    page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve) => {
        const r = indexedDB.open('autonomia-practica');
        r.onsuccess = () => resolve(r.result);
      });
      return new Promise<number>((resolve) => {
        const r = db.transaction('state').objectStore('state').get('current');
        r.onsuccess = () => resolve(r.result.draft.version);
      });
    });
  expect(await version()).toBe(999);
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await expect(page.getByText('Tu avance se guardó en este navegador.')).toBeVisible();
  expect(await version()).toBe(1);
});
test('viewing past practice never overwrites the current unfinished draft', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  await page.getByRole('button', { name: 'Usar este número de ejemplo' }).click();
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await page.getByRole('button', { name: 'Volver a practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  await page.getByLabel('Número de factura de práctica', { exact: true }).fill('1002');
  await page.getByRole('navigation').getByRole('button', { name: 'Inicio', exact: true }).click();
  await page.getByRole('button', { name: 'Ver mis prácticas anteriores' }).click();
  await page.getByRole('button', { name: /Luz ·/ }).click();
  await expect(page.getByRole('dialog')).toContainText('Tu borrador actual sigue guardado');
  await page.getByRole('button', { name: 'Cerrar y conservar mi borrador' }).click();
  await page.getByRole('button', { name: 'Continuar mi práctica', exact: true }).click();
  await expect(page.getByLabel('Número de factura de práctica', { exact: true })).toHaveValue(
    '1002',
  );
});
