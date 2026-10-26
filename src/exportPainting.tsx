import { renderToStaticMarkup } from 'react-dom/server';
import { DrawingCanvas } from './DrawingCanvas';
import type { Drawing } from './drawings';
import type { Colors } from './coloring';

export async function downloadPainting(drawing: Drawing, colors: Colors): Promise<void> {
  const svg = renderToStaticMarkup(<DrawingCanvas drawing={drawing} colors={colors} />);
  const source = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    image.src = source;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1500;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas indisponível');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(result => result ? resolve(result) : reject(new Error('Imagem indisponível')), 'image/png');
    });
    const download = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = download;
    link.download = `pinta-pinta-${drawing.id}.png`;
    document.body.append(link);
    link.click();
    link.remove();
    // Give the browser time to start reading the download before releasing it.
    setTimeout(() => URL.revokeObjectURL(download), 60_000);
  } finally {
    URL.revokeObjectURL(source);
  }
}
