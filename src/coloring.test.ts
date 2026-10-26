import { describe, expect, it } from 'vitest';
import { paintingReducer, parseBook } from './coloring';
import type { Painting } from './coloring';
import { drawings } from './drawings';

const empty = (): Painting => ({ colors: {}, past: [], future: [] });
describe('painting areas', () => {
  it('changes only the selected area', () => {
    const first = paintingReducer(empty(), { type: 'paint', region: 'upper-left', color: '#e65b58' });
    const second = paintingReducer(first, { type: 'paint', region: 'upper-right', color: '#83c2ca' });
    expect(second.colors).toEqual({ 'upper-left': '#e65b58', 'upper-right': '#83c2ca' });
  });
  it('supports undo, redo and clear', () => {
    const painted = paintingReducer(empty(), { type: 'paint', region: 'body', color: '#86bd91' });
    const undone = paintingReducer(painted, { type: 'undo' });
    expect(undone.colors).toEqual({});
    expect(paintingReducer(undone, { type: 'redo' }).colors).toEqual(painted.colors);
    expect(paintingReducer(painted, { type: 'clear' }).colors).toEqual({});
  });
  it('rejects corrupt and unsupported saved data', () => {
    expect(parseBook('broken')).toEqual({});
    expect(parseBook(JSON.stringify({ borboleta: { body: '#86bd91', unknown: '#86bd91', bad: 'url(x)' } }))).toEqual({ borboleta: { body: '#86bd91' } });
  });
  it('contains three drawings with unique closed regions', () => {
    expect(drawings).toHaveLength(3);
    for (const drawing of drawings) expect(new Set(drawing.regions.map(region => region.id)).size).toBe(drawing.regions.length);
  });
  it('restores custom hex colors and rejects invalid color values', () => {
    for (const color of ['#123abc', '#ABCDEF', '#000000', '#ffffff']) {
      expect(parseBook(JSON.stringify({ borboleta: { body: color } }))).toEqual({ borboleta: { body: color } });
    }
    for (const color of ['url(x)', 'red', '#123', '#1234567', '#gggggg', 123456, null]) {
      expect(parseBook(JSON.stringify({ borboleta: { body: color } }))).toEqual({ borboleta: {} });
    }
  });
});
