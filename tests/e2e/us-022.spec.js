// US-022 — Cambiar a idioma Japonés (AzDO #1665465)
// Casos: docs/test-cases/US-022-casos.md

const { test, expect } = require('@playwright/test');

async function elegirIdioma(page, nombre) {
  await page.locator('#btn-idioma').hover();
  await expect(page.locator('#lang-menu')).toBeVisible();
  await page.getByRole('menuitem', { name: nombre }).click();
}

test.describe('US-022 — Cambiar a idioma Japonés', () => {
  test.describe.configure({ mode: 'serial' });

  test('TC-022-01 — Cambiar idioma a Japonés traduce la interfaz', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'ABM de Clientes' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    await elegirIdioma(page, 'Japonés');

    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.getByRole('heading', { name: '顧客管理' })).toBeVisible();
    await expect(page.locator('#form-title')).toHaveText('新規顧客');
    await expect(page.locator('#btn-guardar')).toHaveText('保存');
    await expect(page.getByText('顧客一覧', { exact: true })).toBeVisible();
  });

  test('TC-022-02 — Cambiar idioma a Español restaura las etiquetas', async ({ page }) => {
    await page.goto('/');
    await elegirIdioma(page, 'Japonés');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');

    await elegirIdioma(page, 'Español');

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { name: 'ABM de Clientes' })).toBeVisible();
    await expect(page.locator('#form-title')).toHaveText('Nuevo cliente');
    await expect(page.locator('#btn-guardar')).toHaveText('Guardar');
  });

  test('TC-022-03 — Elegir Español cuando ya está en español no rompe la UI', async ({ page }) => {
    await page.goto('/');
    await elegirIdioma(page, 'Español');

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { name: 'ABM de Clientes' })).toBeVisible();
    await expect(page.locator('#btn-guardar')).toHaveText('Guardar');
  });
});
