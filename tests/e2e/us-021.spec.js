// US-021 — Cambiar a idioma Portugués (Jira SCRUM-5)
// Casos: docs/test-cases/US-021-casos.md

const { test, expect } = require('@playwright/test');

async function elegirIdioma(page, nombre) {
  await page.locator('#btn-idioma').hover();
  await expect(page.locator('#lang-menu')).toBeVisible();
  await page.getByRole('menuitem', { name: nombre }).click();
}

test.describe('US-021 — Cambiar a idioma Portugués', () => {
  test.describe.configure({ mode: 'serial' });

  test('TC-021-01 — Cambiar idioma a Portugués traduce la interfaz', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'ABM de Clientes' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    await elegirIdioma(page, 'Portugués');

    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
    await expect(page.getByRole('heading', { name: 'Cadastro de Clientes' })).toBeVisible();
    await expect(page.locator('#form-title')).toHaveText('Novo cliente');
    await expect(page.locator('#btn-guardar')).toHaveText('Salvar');
    await expect(page.getByText('Clientes', { exact: true })).toBeVisible();
  });

  test('TC-021-02 — Cambiar idioma a Español restaura las etiquetas', async ({ page }) => {
    await page.goto('/');
    await elegirIdioma(page, 'Portugués');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');

    await elegirIdioma(page, 'Español');

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { name: 'ABM de Clientes' })).toBeVisible();
    await expect(page.locator('#form-title')).toHaveText('Nuevo cliente');
    await expect(page.locator('#btn-guardar')).toHaveText('Guardar');
  });

  test('TC-021-03 — Elegir Español cuando ya está en español no rompe la UI', async ({ page }) => {
    await page.goto('/');
    await elegirIdioma(page, 'Español');

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { name: 'ABM de Clientes' })).toBeVisible();
    await expect(page.locator('#btn-guardar')).toHaveText('Guardar');
  });
});
