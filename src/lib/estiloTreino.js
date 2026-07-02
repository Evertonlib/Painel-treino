function normalizar(texto) {
  return (texto || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase()
}

// Paleta de zona alinhada ao espectro fisiológico Z1 (recuperação) → Z5
// (máxima intensidade), o mesmo vocabulário usado no CSV do ciclo.
export const CORES_ZONA = {
  z1: '#4d7ea8',
  z2: '#3f9e83',
  z3: '#d7a233',
  z4: '#dd7a2c',
  z5: '#c73a2f',
  forca: '#7c5cbf',
  off: '#767d87',
}

const ZONAS = [1, 2, 3, 4, 5].reduce((mapa, n) => {
  mapa[n] = { cor: CORES_ZONA[`z${n}`], posicaoRegua: { tipo: 'ponto', valor: n } }
  return mapa
}, {})

const FORCA = { cor: CORES_ZONA.forca, posicaoRegua: null }
const ENDURANCE = { cor: CORES_ZONA.z3, posicaoRegua: { tipo: 'faixa', inicio: 2, fim: 4 } }
const OFF = { cor: CORES_ZONA.off, posicaoRegua: null }
const NEUTRO = { cor: CORES_ZONA.z3, posicaoRegua: null }

export function obterEstiloTreino(tipo) {
  const texto = normalizar(tipo)

  if (texto.startsWith('OFF')) return OFF

  const zona = texto.match(/Z([1-5])/)?.[1]
  const comForca = /FORC/.test(texto)
  const temVo2 = /VO2/.test(texto)

  if (zona) return { ...ZONAS[Number(zona)], comForca }
  if (temVo2) return { ...ZONAS[5], comForca }
  if (comForca) return FORCA
  if (/ENDURANCE/.test(texto)) return ENDURANCE

  return NEUTRO
}
