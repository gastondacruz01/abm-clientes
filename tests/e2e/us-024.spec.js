// US-024 — Cambiar a idioma Chino (Jira SCRUM-7)
// Casos: docs/test-cases/US-024-casos.md

const { test, expect } = require('@playwright/test');

async function elegirIdioma(page, nombre) {
  await page.locator('#btn-idioma').hover();
  await expect(page.locator('#lang-menu')).toBeVisible();
  await page.getByRole('menuitem', { name: nombre }).click();
}

test.describe('US-024 — Cambiar a idioma Chino', () => {
  test.describe.configure({ mode: 'serial' });

  test('TC-024-01 — Cambiar idioma a Chino traduce la interfaz', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'ABM de Clientes' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    await elegirIdioma(page, 'Chino');

    await expect(page.locator('html')).toHaveAttribute('lang', 'zh');
    await expect(page.getByRole('heading', { name: '客户管理' })).toBeVisible();
    await expect(page.locator('#form-title')).toHaveText('新建客户');
    await expect(page.locator('#btn-guardar')).toHaveText('保存');
    await expect(page.getByText('客户列表', { exact: true })).toBeVisible();
  });

  test('TC-024-02 — Cambiar idioma a Español restaura las etiquetas', async ({ page }) => {
    await page.goto('/');
    await elegirIdioma(page, 'Chino');
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh');

    await elegirIdioma(page, 'Español');

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { name: 'ABM de Clientes' })).toBeVisible();
    await expect(page.locator('#form-title')).toHaveText('Nuevo cliente');
    await expect(page.locator('#btn-guardar')).toHaveText('Guardar');
  });

  test('TC-024-03 — Elegir Español cuando ya está en español no rompe la UI', async ({ page }) => {
    await page.goto('/');
    await elegirIdioma(page, 'Español');

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { name: 'ABM de Clientes' })).toBeVisible();
    await expect(page.locator('#btn-guardar')).toHaveText('Guardar');
  });
});
