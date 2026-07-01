const CHAVE_TEMA = 'treinoDoDia:tema:v1'

function temaValido(valor) {
  return valor === 'claro' || valor === 'escuro'
}

export function obterTemaPreferido() {
  try {
    const salvo = localStorage.getItem(CHAVE_TEMA)
    if (temaValido(salvo)) return salvo
  } catch {
    // localStorage indisponível: segue para a preferência do sistema
  }

  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'escuro'
  }

  return 'claro'
}

export function salvarTemaPreferido(tema) {
  try {
    localStorage.setItem(CHAVE_TEMA, tema)
  } catch {
    // localStorage indisponível: preferência só dura a sessão atual
  }
}

export function aplicarTemaNoDocumento(tema) {
  document.documentElement.classList.toggle('dark', tema === 'escuro')
}
