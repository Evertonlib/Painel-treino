import { parseDataBR } from './datas.js'

export function normalizarLinha(linha) {
  const fase = linha.fase ?? ''
  const dia = linha.dia ?? ''
  const tipo = linha.tipo ?? ''
  const treino = linha.treino ?? ''
  const rpe = linha.rpe ?? ''
  const forca = linha.forca ?? ''

  const tempoNumero = Number(linha.tempo)
  const tempo = Number.isNaN(tempoNumero) ? 0 : tempoNumero

  const dataTexto = linha.data ?? ''
  const dataInterpretada = parseDataBR(dataTexto)

  return {
    fase,
    dataTexto,
    dataISO: dataInterpretada.valida ? dataInterpretada.dataISO : null,
    dataValida: dataInterpretada.valida,
    dia,
    tipo,
    treino,
    tempo,
    rpe,
    forca,
    feito: null,
    notaSensacao: null,
  }
}

export function normalizarCiclo(linhas) {
  return linhas.map(normalizarLinha)
}
