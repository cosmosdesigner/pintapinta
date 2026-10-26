import { test, expect } from '@playwright/test';

for (const width of [360, 768, 1280]) {
  test(`paints with a custom color at ${width}px and restores it`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Colorir Borboleta', exact: true }).click();
    const picker = page.getByLabel('Cor personalizada', { exact: true });
    await expect(picker).toBeVisible();
    await picker.focus();
    await expect(picker).toBeFocused();
    await picker.fill('#123abc');
    await expect(page.getByRole('button', { name: 'Vermelho', exact: true })).toHaveAttribute('aria-pressed', 'false');
    const body = page.getByRole('button', { name: 'Pintar: Corpo da borboleta', exact: true });
    await body.focus();
    await page.keyboard.press('Enter');
    await expect(body).toHaveAttribute('fill', '#123abc');
    await expect(page.getByRole('button', { name: 'Pintar: Asa de cima à esquerda', exact: true })).toHaveAttribute('fill', '#ffffff');
    await page.getByRole('button', { name: 'Desfazer', exact: true }).click();
    await expect(body).toHaveAttribute('fill', '#ffffff');
    await page.getByRole('button', { name: 'Refazer', exact: true }).click();
    await expect(body).toHaveAttribute('fill', '#123abc');
    await page.getByRole('button', { name: 'Azul', exact: true }).click();
    await body.press('Space');
    await expect(body).toHaveAttribute('fill', '#83c2ca');
    await page.getByRole('button', { name: 'Desfazer', exact: true }).click();
    await page.reload();
    await page.getByRole('button', { name: 'Continuar Borboleta', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Pintar: Corpo da borboleta', exact: true })).toHaveAttribute('fill', '#123abc');
  });
}

test('paints an area, supports undo and restores after reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Colorir Borboleta', exact: true }).click();
  await page.getByRole('button', { name: 'Azul', exact: true }).click();
  const body = page.getByRole('button', { name: 'Pintar: Corpo da borboleta', exact: true });
  await body.click();
  await expect(body).toHaveAttribute('fill', '#83c2ca');
  await page.getByRole('button', { name: 'Desfazer', exact: true }).click();
  await expect(body).toHaveAttribute('fill', '#ffffff');
  await page.getByRole('button', { name: 'Refazer', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Continuar Borboleta', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pintar: Corpo da borboleta', exact: true })).toHaveAttribute('fill', '#83c2ca');
});

test('keeps the three drawings independent', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Colorir Borboleta', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Colorir Tartaruga', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Colorir Foguetão', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Colorir Foguetão', exact: true }).click();
  await page.getByRole('button', { name: 'Pintar: Janela', exact: true }).click();
  await page.getByRole('button', { name: 'Desenhos', exact: true }).click();
  await page.getByRole('button', { name: 'Colorir Tartaruga', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pintar: Cabeça', exact: true })).toHaveAttribute('fill', '#ffffff');
});
