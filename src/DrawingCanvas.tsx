import type { Drawing } from './drawings';
import type { Colors } from './coloring';

interface Props { drawing: Drawing; colors?: Colors; preview?: boolean; onPaint?: (region: string) => void }
export function DrawingCanvas({ drawing, colors = {}, preview = false, onPaint }: Props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500" className="drawing" aria-label={onPaint ? `Desenho para colorir: ${drawing.title}` : undefined}
    aria-hidden={onPaint ? undefined : true} role={onPaint ? 'group' : undefined}>
    <g stroke="#45362e" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
      {drawing.regions.map(region => <path key={region.id} d={region.d}
        data-region={region.id} fill={colors[region.id] ?? (preview ? region.sample : '#ffffff')}
        role={onPaint ? 'button' : undefined} tabIndex={onPaint ? 0 : undefined}
        aria-label={onPaint ? `Pintar: ${region.label}` : undefined}
        onClick={onPaint ? () => onPaint(region.id) : undefined}
        onKeyDown={onPaint ? event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onPaint(region.id); } } : undefined}
        className={onPaint ? 'paint-region' : undefined} />)}
      <g fill="none" pointerEvents="none" aria-hidden="true">
        {drawing.details.map((d, index) => <path key={index} d={d} />)}
      </g>
    </g>
  </svg>;
}
