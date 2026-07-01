function CartaoCicloForaDoIntervalo({ variante, dataInicio, dataFim }) {
  const conteudo = {
    antes: {
      titulo: 'O ciclo ainda não começou',
      texto: `Este ciclo começa em ${dataInicio}.`,
    },
    depois: {
      titulo: 'Este ciclo já terminou',
      texto: `O ciclo terminou em ${dataFim}. Carregue um novo ciclo para continuar.`,
    },
    semAmanha: {
      titulo: 'Sem dado para amanhã',
      texto: 'Amanhã está fora do ciclo carregado.',
    },
  }[variante]

  if (!conteudo) return null

  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
      <div className="font-semibold text-gray-700">{conteudo.titulo}</div>
      <p className="text-sm text-gray-500 mt-1">{conteudo.texto}</p>
    </div>
  )
}

export default CartaoCicloForaDoIntervalo
