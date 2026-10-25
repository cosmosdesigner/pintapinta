import { drawings, palette } from './drawings';

export type Colors = Record<string, string>;
export type Book = Record<string, Colors>;
export interface Painting { colors: Colors; past: Colors[]; future: Colors[] }
export type Action = { type: 'paint'; region: string; color: string } | { type: 'undo' } | { type: 'redo' } | { type: 'clear' };
export const STORAGE_KEY = 'pintapinta.book.v1';

export function paintingReducer(state: Painting, action: Action): Painting {
  if (action.type === 'undo') {
    if (!state.past.length) return state;
    return { colors: state.past.at(-1)!, past: state.past.slice(0, -1), future: [state.colors, ...state.future] };
  }
  if (action.type === 'redo') {
    if (!state.future.length) return state;
    return { colors: state.future[0], past: [...state.past, state.colors], future: state.future.slice(1) };
  }
  if (action.type === 'clear' && !Object.keys(state.colors).length) return state;
  if (action.type === 'paint' && (state.colors[action.region] ?? '#ffffff') === action.color) return state;
  const colors = action.type === 'clear' ? {} : { ...state.colors, [action.region]: action.color };
  return { colors, past: [...state.past.slice(-99), state.colors], future: [] };
}

export function parseBook(raw: string | null): Book {
  try {
    const data: unknown = JSON.parse(raw ?? '{}');
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    const source = data as Record<string, unknown>;
    const book: Book = {};
    for (const drawing of drawings) {
      const entry = source[drawing.id];
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
      const colors: Colors = {};
      for (const region of drawing.regions) {
        const value = (entry as Record<string, unknown>)[region.id];
        if (typeof value === 'string' && palette.some(color => color.value === value)) colors[region.id] = value;
      }
      book[drawing.id] = colors;
    }
    return book;
  } catch { return {}; }
}

export function loadBook(): Book {
  try { return parseBook(localStorage.getItem(STORAGE_KEY)); } catch { return {}; }
}

export function saveBook(book: Book): boolean {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(book)); return true; } catch { return false; }
}
