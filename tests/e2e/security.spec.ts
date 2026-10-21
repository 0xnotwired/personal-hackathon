import { test, expect } from '@playwright/test';

const credentialFields = (page: import('@playwright/test').Page) =>
  page.locator(
    'input[type="password"], input[autocomplete^="cc-"], input[name*="pin" i], input[name*="otp" i], input[name*="cvv" i]',
  );

test('home identifies the simulator and no screen requests credentials or another origin', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.protocol.startsWith('http') && url.origin !== 'http://localhost:3000')
      external.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByText(/No es tu banco ni una app de pagos real/)).toBeVisible();
  expect(await credentialFields(page).count()).toBe(0);
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  expect(await credentialFields(page).count()).toBe(0);
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  expect(await credentialFields(page).count()).toBe(0);
  await page.getByRole('button', { name: 'Usar este número de ejemplo' }).click();
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  expect(await credentialFields(page).count()).toBe(0);
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¡Pago de práctica completado!' })).toBeVisible();
  expect(await credentialFields(page).count()).toBe(0);
  expect(external).toEqual([]);
});

test('security headers and a secure session cookie are present', async ({ page, browser }) => {
  const home = await page.request.get('/');
  const headers = home.headers();
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('same-origin');
  expect(headers['permissions-policy']).toContain('microphone=(self)');
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(headers['strict-transport-security']).toContain('max-age=');
  expect(headers['cross-origin-resource-policy']).toBe('same-origin');

  const context = await browser.newContext();
  const response = await context.request.post('http://localhost:3000/api/reviews', {
    headers: { Origin: 'http://localhost:3000', 'x-forwarded-proto': 'https' },
    data: {
      draftId: crypto.randomUUID(),
      key: crypto.randomUUID(),
      service: 'luz',
      code: '100200300',
    },
  });
  expect(response.status()).toBe(200);
  const cookie = response.headers()['set-cookie'] || '';
  expect(cookie).toContain('Secure');
  expect(cookie).toContain('HttpOnly');
  expect(cookie).toMatch(/SameSite=Strict/i);
  expect(cookie).toContain('Max-Age=604800');
  await context.close();
});

test('deleting practice data removes local and server records', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  await page.getByRole('button', { name: 'Usar este número de ejemplo' }).click();
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¡Pago de práctica completado!' })).toBeVisible();
  await page.getByRole('button', { name: 'Volver al inicio', exact: true }).click();
  await page.getByRole('button', { name: 'Ayuda y opciones' }).click();
  await page.getByRole('button', { name: 'Ver mis prácticas anteriores' }).click();
  await expect(page.getByRole('button', { name: /Luz ·/ })).toHaveCount(1);
  await page.getByRole('button', { name: 'Borrar mis datos de práctica' }).click();
  await expect(page.getByRole('dialog')).toContainText('No se puede deshacer');
  await page.getByRole('button', { name: 'Sí, borrar todo', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¿Qué necesitás hacer?' })).toBeVisible();
  await expect(page.getByText('Continuar mi práctica')).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('Continuar mi práctica')).toHaveCount(0);
  await page.getByRole('button', { name: 'Ayuda y opciones' }).click();
  await page.getByRole('button', { name: 'Ver mis prácticas anteriores' }).click();
  await expect(page.getByText('Todavía no hay prácticas registradas.')).toBeVisible();
});
