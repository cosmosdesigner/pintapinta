# Pinta-Pinta agent rules

## Product

Pinta-Pinta is a child-friendly responsive web app. Coloring is area-based: each SVG region is a closed path that fills on click or tap. Never replace this with freehand drawing.

## Verification

- Run \`npm run verify\` before proposing a PR.
- Keep the palette and painting state local to the browser unless a feature explicitly adds persistence.
- Test behavior through accessible labels and user actions.
- Keep workflows and agent instructions protected from feature changes.
- Features are delivered in branches and pull requests; never merge or push to \`main\` from an agent run.

## UI

Use large touch targets, clear Portuguese copy, visible focus states, keyboard support, and responsive layouts at phone, tablet, and desktop widths.
