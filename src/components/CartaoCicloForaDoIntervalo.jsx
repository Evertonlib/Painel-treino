function CartaoCicloForaDoIntervalo({ variante, dataInicio, dataFim }) {
  const conteudo = {
    antes: {
      icone: '🗓️',
      titulo: 'O ciclo ainda não começou',
      texto: `Este ciclo começa em ${dataInicio}.`,
    },
    depois: {
      icone: '🏁',
      titulo: 'Este ciclo já terminou',
      texto: `O ciclo terminou em ${dataFim}. Carregue um novo ciclo para continuar.`,
    },
    semAmanha: {
      icone: '📭',
      titulo: 'Sem dado para amanhã',
      texto: 'Amanhã está fora do ciclo carregado.',
    },
  }[variante]

  if (!conteudo) return null

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-2 text-3xl" aria-hidden="true">
        {conteudo.icone}
      </div>
      <div className="font-semibold text-slate-700 dark:text-slate-200">{conteudo.titulo}</div>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{conteudo.texto}</p>
    </div>
  )
}

export default CartaoCicloForaDoIntervalo
