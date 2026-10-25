import { useEffect, useReducer, useRef, useState } from 'react';
import { DrawingCanvas } from './DrawingCanvas';
import { drawings, palette } from './drawings';
import type { Drawing } from './drawings';
import { loadBook, paintingReducer, saveBook } from './coloring';
import type { Book, Colors } from './coloring';

function Icon({ name }: { name: 'back' | 'undo' | 'redo' | 'clear' | 'check' }) {
  const paths = { back: 'm14 6-6 6 6 6M8 12h12', undo: 'M9 5 4 10l5 5M4 10h10a6 6 0 0 1 0 12', redo: 'm15 5 5 5-5 5m5-5H10a6 6 0 0 0 0 12', clear: 'm8 7 8 0m-10 0h12M9 7V4h6v3m-8 0 1 14h8l1-14M10 10v8m4-8v8', check: 'm5 12 4 4L19 6' };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

function Studio({ drawing, initialColors, onBack, onChange }: { drawing: Drawing; initialColors: Colors; onBack: () => void; onChange: (colors: Colors) => boolean }) {
  const [state, dispatch] = useReducer(paintingReducer, { colors: initialColors, past: [], future: [] });
  const [selected, setSelected] = useState(palette[0]);
  const [saved, setSaved] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const clearDialog = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { titleRef.current?.focus(); }, []);
  useEffect(() => { setSaved(onChange(state.colors)); }, [state.colors, onChange]);

  function paint(region: string) {
    dispatch({ type: 'paint', region, color: selected.value });
    const label = drawing.regions.find(item => item.id === region)?.label;
    setAnnouncement(`${label}: ${selected.name.toLowerCase()}.`);
  }

  return <main className="studio">
    <div className="studio-heading">
      <button className="plain-button" onClick={onBack}><Icon name="back" /><span>Desenhos</span></button>
      <h1 ref={titleRef} tabIndex={-1}>{drawing.title}</h1>
      <span className="save-note">{saved ? 'Guardado neste dispositivo' : 'Não foi possível guardar neste dispositivo'}</span>
    </div>
    <div className="workspace">
      <section className="paper" aria-label="Folha para colorir"><DrawingCanvas drawing={drawing} colors={state.colors} onPaint={paint} /></section>
      <aside className="tools" aria-label="Cores e ferramentas">
        <div className="palette-heading"><h2>Escolhe uma cor</h2><span>{selected.name}</span></div>
        <div className="palette" role="group" aria-label="Paleta de cores">
          {palette.map(color => <button key={color.value} type="button" className={`swatch ${selected.value === color.value ? 'selected' : ''}`}
            aria-label={color.name} aria-pressed={selected.value === color.value} style={{ backgroundColor: color.value }} onClick={() => setSelected(color)}>
            {selected.value === color.value && <span className="swatch-check"><Icon name="check" /></span>}
          </button>)}
        </div>
        <p className="instruction">Agora toca numa parte do desenho!</p>
        <div className="history-tools">
          <button className="tool-button" onClick={() => dispatch({ type: 'undo' })} disabled={!state.past.length}><Icon name="undo" /><span>Desfazer</span></button>
          <button className="tool-button" onClick={() => dispatch({ type: 'redo' })} disabled={!state.future.length}><Icon name="redo" /><span>Refazer</span></button>
        </div>
        <button className="clear-button" disabled={!Object.keys(state.colors).length} onClick={() => clearDialog.current?.showModal()}><Icon name="clear" />Começar de novo</button>
      </aside>
    </div>
    <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    <dialog ref={clearDialog} aria-labelledby="clear-title" className="clear-dialog">
      <h2 id="clear-title">Começar de novo?</h2><p>Este desenho vai ficar sem cores. Podes desfazer depois.</p>
      <div className="dialog-actions"><button className="plain-button" autoFocus onClick={() => clearDialog.current?.close()}>Continuar a pintar</button>
        <button className="primary-button" onClick={() => { dispatch({ type: 'clear' }); clearDialog.current?.close(); }}>Limpar desenho</button></div>
    </dialog>
  </main>;
}

export function App() {
  const [book, setBook] = useState<Book>(loadBook);
  const [active, setActive] = useState<Drawing | null>(null);
  // A stable callback avoids saving again when the parent updates its book.
  const bookRef = useRef(book);
  const activeRef = useRef<string | null>(null);
  const update = useRef((colors: Colors): boolean => {
    if (!activeRef.current) return false;
    const next = { ...bookRef.current, [activeRef.current]: colors };
    bookRef.current = next;
    setBook(next);
    return saveBook(next);
  }).current;
  const opener = useRef<HTMLButtonElement | null>(null);

  function goBack() {
    setActive(null);
    activeRef.current = null;
    requestAnimationFrame(() => document.getElementById(opener.current?.id ?? '')?.focus());
  }

  return <>
    <header className="site-header"><a className="brand" href="#" onClick={event => { event.preventDefault(); if (active) goBack(); }} aria-label="Pinta-Pinta — escolher desenho">
      <img src="./icon.svg" width="38" height="38" alt="" />Pinta<span>-Pinta</span></a>
      <span className="header-note">Pequenas mãos, grandes ideias.</span></header>
    {active ? <Studio key={active.id} drawing={active} initialColors={book[active.id] ?? {}} onBack={goBack} onChange={update} /> :
      <main className="gallery">
        <div className="gallery-heading"><h1>Vamos colorir?</h1><p>Escolhe o teu desenho. As cores ficam por tua conta.</p></div>
        <div className="drawing-grid">{drawings.map((drawing, index) => {
          const started = Object.keys(book[drawing.id] ?? {}).length > 0;
          return <button className={`drawing-choice drawing-choice-${index}`} key={drawing.id} id={`choose-${drawing.id}`}
            onClick={event => { opener.current = event.currentTarget; activeRef.current = drawing.id; setActive(drawing); }} aria-label={`${started ? 'Continuar' : 'Colorir'} ${drawing.title}`}>
            <div className="thumbnail"><DrawingCanvas drawing={drawing} preview={!started} colors={started ? book[drawing.id] : undefined} /></div>
            <div className="drawing-caption"><div><h2>{drawing.title}</h2><p>{drawing.description}</p></div><span className="choice-arrow" aria-hidden="true">↗</span></div>
            <span className="choice-action">{started ? 'Continuar a pintar' : 'Quero pintar!'}</span>
          </button>;
        })}</div>
        <p className="gallery-hint">Uma cor + um toque = um bocadinho de magia.</p>
      </main>}
    <footer>Feito para explorar, sem sair das linhas.</footer>
  </>;
}
