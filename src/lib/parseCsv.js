import Papa from 'papaparse'

const COLUNAS_OBRIGATORIAS = [
  'fase',
  'data',
  'dia',
  'tipo',
  'treino',
  'tempo',
  'rpe',
  'forca',
]

function normalizarNomeColuna(nome) {
  return typeof nome === 'string' ? nome.trim().toLowerCase() : ''
}

export async function lerArquivoCsv(arquivo) {
  const texto = await arquivo.text()

  if (!texto || !texto.trim()) {
    throw new Error('arquivo vazio ou ilegível')
  }

  const resultado = Papa.parse(texto, {
    header: true,
    skipEmptyLines: true,
  })

  const colunasDetectadas = (resultado.meta.fields || []).map(
    normalizarNomeColuna
  )

  if (colunasDetectadas.length === 0 || resultado.data.length === 0) {
    throw new Error('arquivo vazio ou ilegível')
  }

  const faltaAlgumaColuna = COLUNAS_OBRIGATORIAS.some(
    (coluna) => !colunasDetectadas.includes(coluna)
  )
  if (faltaAlgumaColuna) {
    console.error(
      'CSV não contém as colunas obrigatórias. Colunas detectadas:',
      colunasDetectadas
    )
    throw new Error('arquivo não tem o formato esperado')
  }

  return resultado.data.map((linha) => {
    const linhaNormalizada = {}
    for (const [chave, valor] of Object.entries(linha)) {
      linhaNormalizada[normalizarNomeColuna(chave)] = valor
    }
    return linhaNormalizada
  })
}
