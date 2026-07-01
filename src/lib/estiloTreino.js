function normalizar(texto) {
  return (texto || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase()
}

const CATEGORIAS = {
  descanso: {
    icone: '🛌',
    ponto: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
    destaque: 'border-slate-200 dark:border-slate-700',
    acento: 'from-slate-300 to-slate-200',
  },
  combo: {
    icone: '🔀',
    ponto: 'bg-teal-500',
    badge: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-800',
    destaque: 'border-teal-200 dark:border-teal-800',
    acento: 'from-teal-500 to-emerald-400',
  },
  forca: {
    icone: '🏋️',
    ponto: 'bg-violet-500',
    badge: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-800',
    destaque: 'border-violet-200 dark:border-violet-800',
    acento: 'from-violet-500 to-purple-400',
  },
  intenso: {
    icone: '🔥',
    ponto: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-800',
    destaque: 'border-rose-200 dark:border-rose-800',
    acento: 'from-rose-500 to-orange-400',
  },
  forte: {
    icone: '🏃',
    ponto: 'bg-orange-500',
    badge: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:ring-orange-800',
    destaque: 'border-orange-200 dark:border-orange-800',
    acento: 'from-orange-500 to-amber-400',
  },
  moderado: {
    icone: '🏃',
    ponto: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800',
    destaque: 'border-amber-200 dark:border-amber-800',
    acento: 'from-amber-500 to-yellow-400',
  },
  leve: {
    icone: '🏃',
    ponto: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800',
    destaque: 'border-emerald-200 dark:border-emerald-800',
    acento: 'from-emerald-500 to-teal-400',
  },
  muitoLeve: {
    icone: '🏃',
    ponto: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-800',
    destaque: 'border-sky-200 dark:border-sky-800',
    acento: 'from-sky-500 to-blue-400',
  },
  neutro: {
    icone: '🏃',
    ponto: 'bg-indigo-500',
    badge: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:ring-indigo-800',
    destaque: 'border-indigo-200 dark:border-indigo-800',
    acento: 'from-indigo-500 to-blue-400',
  },
}

export function obterEstiloTreino(tipo) {
  const texto = normalizar(tipo)

  if (texto.startsWith('OFF')) return CATEGORIAS.descanso

  const temForca = /FORC/.test(texto)
  const zona = texto.match(/Z([1-5])/)?.[1]
  const temVo2 = /VO2/.test(texto)

  if (temForca && (zona || temVo2)) return CATEGORIAS.combo
  if (temForca) return CATEGORIAS.forca
  if (temVo2 || zona === '5') return CATEGORIAS.intenso
  if (zona === '4') return CATEGORIAS.forte
  if (zona === '3') return CATEGORIAS.moderado
  if (zona === '2') return CATEGORIAS.leve
  if (zona === '1') return CATEGORIAS.muitoLeve
  return CATEGORIAS.neutro
}
