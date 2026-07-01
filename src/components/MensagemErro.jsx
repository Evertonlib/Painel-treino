function MensagemErro({ mensagem }) {
  if (!mensagem) return null

  return (
    <div
      role="alert"
      className="rounded-lg border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm"
    >
      {mensagem}
    </div>
  )
}

export default MensagemErro
