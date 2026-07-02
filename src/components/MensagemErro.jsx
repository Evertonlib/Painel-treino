import { IconeAlerta } from './icones.jsx'

function MensagemErro({ mensagem }) {
  if (!mensagem) return null

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-pista/30 bg-pista/5 px-4 py-3 text-sm text-pista-dark dark:text-pista"
    >
      <IconeAlerta className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{mensagem}</span>
    </div>
  )
}

export default MensagemErro
