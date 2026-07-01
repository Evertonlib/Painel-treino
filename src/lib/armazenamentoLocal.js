const CHAVE = 'treinoDoDia:ciclo:v1'
const VERSAO_ATUAL = 1

export function salvarCiclo({ nomeArquivoOriginal, registros }) {
  const valor = {
    versao: VERSAO_ATUAL,
    carregadoEm: new Date().toISOString(),
    nomeArquivoOriginal,
    registros,
  }
  localStorage.setItem(CHAVE, JSON.stringify(valor))
  return valor
}

export function carregarCiclo() {
  const bruto = localStorage.getItem(CHAVE)
  if (!bruto) return null

  try {
    const valor = JSON.parse(bruto)
    if (!valor || !Array.isArray(valor.registros)) return null
    return valor
  } catch {
    return null
  }
}

export function limparCiclo() {
  localStorage.removeItem(CHAVE)
}
