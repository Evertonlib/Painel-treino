import { useEffect, useState } from 'react'
import { obterTemaPreferido, salvarTemaPreferido, aplicarTemaNoDocumento } from '../lib/tema.js'

function BotaoAlternarTema({ className = '' }) {
  const [tema, setTema] = useState(() => obterTemaPreferido())

  useEffect(() => {
    aplicarTemaNoDocumento(tema)
  }, [tema])

  function alternarTema() {
    setTema((atual) => {
      const proximo = atual === 'escuro' ? 'claro' : 'escuro'
      salvarTemaPreferido(proximo)
      return proximo
    })
  }

  const escuro = tema === 'escuro'

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={escuro ? 'Ativar tema claro' : 'Ativar tema escuro'}
      aria-pressed={escuro}
      className={
        className ||
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-base shadow-sm transition-colors active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:active:bg-slate-700 dark:focus-visible:ring-offset-slate-900'
      }
    >
      <span aria-hidden="true">{escuro ? '☀️' : '🌙'}</span>
    </button>
  )
}

export default BotaoAlternarTema
