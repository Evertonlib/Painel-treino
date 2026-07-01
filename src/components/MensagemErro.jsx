function MensagemErro({ mensagem }) {
  if (!mensagem) return null

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
    >
      <span aria-hidden="true">⚠️</span>
      <span>{mensagem}</span>
    </div>
  )
}

export default MensagemErro
