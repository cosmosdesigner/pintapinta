import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

for (const width of [360, 768, 1280]) {
  test(`downloads the current painting with the keyboard at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Colorir Borboleta', exact: true }).click();
    await page.getByLabel('Cor personalizada', { exact: true }).fill('#123abc');
    const body = page.getByRole('button', { name: 'Pintar: Corpo da borboleta', exact: true });
    await body.press('Enter');
    await page.getByRole('button', { name: 'Azul', exact: true }).click();
    await body.press('Space');
    await page.getByRole('button', { name: 'Desfazer', exact: true }).click();
    const save = page.getByRole('button', { name: 'Guardar imagem', exact: true });
    await save.focus();
    const pending = page.waitForEvent('download');
    await save.press('Enter');
    const download = await pending;
    expect(download.suggestedFilename()).toBe('pinta-pinta-borboleta.png');
    const file = await download.path();
    const bytes = await readFile(file!);
    const exported = await page.evaluate(async data => {
      const image = new Image();
      image.src = `data:image/png;base64,${data}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0);
      return {
        width: image.width, height: image.height,
        body: [...context.getImageData(750, 840, 1, 1).data],
        background: [...context.getImageData(0, 0, 1, 1).data],
        unpainted: [...context.getImageData(450, 600, 1, 1).data],
        outline: [...context.getImageData(699, 840, 1, 1).data],
      };
    }, bytes.toString('base64'));
    expect(exported).toEqual({ width: 1500, height: 1500, body: [18, 58, 188, 255], background: [255, 255, 255, 255], unpainted: [255, 255, 255, 255], outline: [69, 54, 46, 255] });
    await expect(page.getByRole('status').filter({ hasText: 'Imagem pronta!' })).toBeVisible();
    await expect(body).toHaveAttribute('fill', '#123abc');
    await expect(page.getByRole('button', { name: 'Refazer', exact: true })).toBeEnabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('reports export errors and lets the user retry', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Colorir Foguetão', exact: true }).click();
  await page.getByRole('button', { name: 'Pintar: Janela', exact: true }).click();
  await page.evaluate(() => {
    const original = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (callback) {
      HTMLCanvasElement.prototype.toBlob = original;
      callback(null);
    };
  });
  const save = page.getByRole('button', { name: 'Guardar imagem', exact: true });
  await save.click();
  await expect(page.getByRole('status').filter({ hasText: 'Não foi possível guardar a imagem' })).toBeVisible();
  await expect(save).toBeEnabled();
  const pending = page.waitForEvent('download');
  await save.click();
  expect((await pending).suggestedFilename()).toBe('pinta-pinta-foguetao.png');
  await expect(page.getByRole('button', { name: 'Pintar: Janela', exact: true })).toHaveAttribute('fill', '#e65b58');
});
