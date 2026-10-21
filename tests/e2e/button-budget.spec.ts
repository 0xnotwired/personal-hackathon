import { test, expect, Page } from '@playwright/test';

function visibleMainActions(page: Page) {
  return page.evaluate(
    () =>
      Array.from(
        document.querySelectorAll<HTMLElement>('main button, main [role="button"]'),
      ).filter((element) => {
        const closedDetails = element.closest('details') as HTMLDetailsElement | null;
        if (closedDetails && !closedDetails.open) return false;
        const rect = element.getBoundingClientRect();
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          getComputedStyle(element).visibility !== 'hidden' &&
          !element.closest('.flow-top')
        );
      }).length,
  );
}

async function expectBudget(page: Page, place: string) {
  const count = await visibleMainActions(page);
  expect(count, `${place} shows more than two visible actions`).toBeLessThanOrEqual(2);
}

test('every screen keeps at most two visible actions outside the persistent flow bar', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '¿Qué necesitás hacer?' })).toBeVisible();
  await expectBudget(page, 'home');

  await page.getByRole('button', { name: 'Quiero practicar', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¿Qué servicio querés pagar?' })).toBeVisible();
  await expectBudget(page, 'service');

  await page.getByRole('button', { name: 'Seguir con luz', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Busquemos tu factura de práctica' }),
  ).toBeVisible();
  await expectBudget(page, 'bill');

  await page.getByLabel('Número de factura de práctica', { exact: true }).fill('100200300');
  await page.getByRole('button', { name: 'Buscar factura', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Revisá antes de confirmar' })).toBeVisible();
  await expectBudget(page, 'review');
  await page.waitForTimeout(950);

  // Sustain the submitting step by dropping the commit response, like the
  // recovery suite does: an unresolved result must not be presented as success.
  await page.route('**/api/operations', (route) =>
    route.request().method() === 'POST' ? route.abort('failed') : route.continue(),
  );
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Estamos consultando el resultado' }),
  ).toBeVisible();
  await expectBudget(page, 'submitting');

  await page.unroute('**/api/operations');
  await page.getByRole('button', { name: 'Consultar resultado', exact: true }).click();
  await expect(page.locator('#flow-error')).toContainText('El registro no tiene');
  await page
    .getByRole('button', { name: 'Volver a revisar la misma factura', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: 'Revisá antes de confirmar' })).toBeVisible();
  await expectBudget(page, 'review again');
  await page.waitForTimeout(950);
  await page.getByRole('button', { name: 'Confirmar pago de práctica', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¡Pago de práctica completado!' })).toBeVisible();
  await expectBudget(page, 'result');
});
