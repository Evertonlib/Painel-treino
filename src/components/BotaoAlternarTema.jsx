import { useEffect, useState } from 'react'
import { obterTemaPreferido, salvarTemaPreferido, aplicarTemaNoDocumento } from '../lib/tema.js'
import { IconeSol, IconeLua } from './icones.jsx'

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
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-grafite/15 text-grafite/70 transition-colors active:bg-grafite/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pista focus-visible:ring-offset-2 dark:border-giz/15 dark:text-giz/70 dark:active:bg-giz/5 dark:focus-visible:ring-offset-grafite'
      }
    >
      {escuro ? <IconeSol className="h-4 w-4" /> : <IconeLua className="h-4 w-4" />}
    </button>
  )
}

export default BotaoAlternarTema
