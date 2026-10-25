export interface Region { id: string; label: string; d: string; sample: string }
export interface Drawing { id: string; title: string; description: string; regions: Region[]; details: string[] }

// Closed vector regions make filling deterministic: there is no flood fill or freehand canvas.
export const drawings: Drawing[] = [
  {
    id: 'borboleta', title: 'Borboleta', description: 'Asas cheias de imaginação',
    regions: [
      { id: 'upper-left', label: 'Asa de cima à esquerda', d: 'M244 245C205 158 120 100 79 145C28 201 94 278 239 281Z', sample: '#b69adc' },
      { id: 'upper-right', label: 'Asa de cima à direita', d: 'M256 245C295 158 380 100 421 145C472 201 406 278 261 281Z', sample: '#b69adc' },
      { id: 'lower-left', label: 'Asa de baixo à esquerda', d: 'M240 274C158 248 95 294 117 359C139 420 206 389 246 312Z', sample: '#f5b73e' },
      { id: 'lower-right', label: 'Asa de baixo à direita', d: 'M260 274C342 248 405 294 383 359C361 420 294 389 254 312Z', sample: '#f5b73e' },
      { id: 'spot-left', label: 'Mancha da asa esquerda', d: 'M173 204C160 163 103 162 108 202C113 238 161 249 173 204Z', sample: '#f18aa5' },
      { id: 'spot-right', label: 'Mancha da asa direita', d: 'M327 204C340 163 397 162 392 202C387 238 339 249 327 204Z', sample: '#f18aa5' },
      { id: 'spot-bottom-left', label: 'Mancha de baixo à esquerda', d: 'M198 315C176 288 141 313 150 341C162 372 192 351 198 315Z', sample: '#ee8452' },
      { id: 'spot-bottom-right', label: 'Mancha de baixo à direita', d: 'M302 315C324 288 359 313 350 341C338 372 308 351 302 315Z', sample: '#ee8452' },
      { id: 'body', label: 'Corpo da borboleta', d: 'M231 228C228 195 272 195 269 228L267 306C266 357 234 357 233 306Z', sample: '#86bd91' },
    ],
    details: ['M240 205Q224 158 207 164M260 205Q276 158 293 164', 'M241 228h1M258 228h1', 'M242 242Q250 250 258 242'],
  },
  {
    id: 'tartaruga', title: 'Tartaruga', description: 'Uma amiga muito tranquila',
    regions: [
      { id: 'back-foot', label: 'Pata de trás', d: 'M144 310Q113 352 133 371Q162 390 188 329Z', sample: '#86bd91' },
      { id: 'front-foot', label: 'Pata da frente', d: 'M276 323Q274 375 310 372Q340 363 315 315Z', sample: '#86bd91' },
      { id: 'tail', label: 'Cauda', d: 'M122 297 72 281Q79 314 127 320Z', sample: '#86bd91' },
      { id: 'head', label: 'Cabeça', d: 'M316 273C339 262 331 199 376 194C443 183 456 274 405 298Q371 315 329 310Z', sample: '#86bd91' },
      { id: 'shell', label: 'Contorno da carapaça', d: 'M114 294C114 119 326 119 337 294Q334 337 226 343Q125 342 114 294Z', sample: '#f5b73e' },
      { id: 'shell-top', label: 'Carapaça de cima', d: 'M170 187Q224 151 278 187L267 230H183Z', sample: '#83c2ca' },
      { id: 'shell-left', label: 'Carapaça à esquerda', d: 'M170 187 183 230 163 283 126 286Q126 222 170 187Z', sample: '#86bd91' },
      { id: 'shell-center', label: 'Centro da carapaça', d: 'M183 230H267L288 282 250 317H199L163 283Z', sample: '#b69adc' },
      { id: 'shell-right', label: 'Carapaça à direita', d: 'M278 187Q320 220 325 285L288 282 267 230Z', sample: '#86bd91' },
      { id: 'shell-bottom-left', label: 'Carapaça em baixo à esquerda', d: 'M126 286 163 283 199 317Q144 321 126 300Z', sample: '#f18aa5' },
      { id: 'shell-bottom-right', label: 'Carapaça em baixo à direita', d: 'M288 282 325 285 325 300Q303 320 250 317Z', sample: '#f18aa5' },
    ],
    details: ['M398 226h1', 'M406 258Q416 265 427 253', 'M144 357l5 5M304 355l5 5'],
  },
  {
    id: 'foguetao', title: 'Foguetão', description: 'Uma viagem às tuas cores',
    regions: [
      { id: 'flame', label: 'Chama', d: 'M213 337Q192 390 250 440Q308 390 287 337Z', sample: '#f5b73e' },
      { id: 'inner-flame', label: 'Centro da chama', d: 'M238 354Q221 388 250 411Q279 388 262 354Z', sample: '#ee8452' },
      { id: 'left-fin', label: 'Asa esquerda', d: 'M202 247Q145 255 141 345L202 316Z', sample: '#f18aa5' },
      { id: 'right-fin', label: 'Asa direita', d: 'M298 247Q355 255 359 345L298 316Z', sample: '#f18aa5' },
      { id: 'body', label: 'Corpo do foguetão', d: 'M250 80Q180 142 195 321H305Q320 142 250 80Z', sample: '#83c2ca' },
      { id: 'nose', label: 'Ponta do foguetão', d: 'M250 80Q215 111 203 153H297Q285 111 250 80Z', sample: '#ee8452' },
      { id: 'window-frame', label: 'Moldura da janela', d: 'M288 221A38 38 0 1 1 212 221A38 38 0 1 1 288 221Z', sample: '#f5b73e' },
      { id: 'window', label: 'Janela', d: 'M274 221A24 24 0 1 1 226 221A24 24 0 1 1 274 221Z', sample: '#b69adc' },
      { id: 'base', label: 'Base do foguetão', d: 'M195 298H305V332Q250 349 195 332Z', sample: '#86bd91' },
      { id: 'star-left', label: 'Estrela esquerda', d: 'M103 112 113 133 137 136 119 153 123 177 103 166 82 177 87 153 69 136 93 133Z', sample: '#f5b73e' },
      { id: 'star-right', label: 'Estrela direita', d: 'M399 164 409 185 433 188 415 205 419 229 399 218 378 229 383 205 365 188 389 185Z', sample: '#f5b73e' },
    ],
    details: ['M236 210Q239 206 246 205'],
  },
];

export const palette = [
  { name: 'Vermelho', value: '#e65b58' }, { name: 'Laranja', value: '#ee8452' },
  { name: 'Amarelo', value: '#f5b73e' }, { name: 'Verde', value: '#86bd91' },
  { name: 'Azul', value: '#83c2ca' }, { name: 'Roxo', value: '#b69adc' },
  { name: 'Rosa', value: '#f18aa5' }, { name: 'Castanho', value: '#ac8061' },
  { name: 'Preto', value: '#45362e' }, { name: 'Branco', value: '#ffffff' },
];
