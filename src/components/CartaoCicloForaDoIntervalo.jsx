import { IconeCalendario, IconeBandeira, IconeCaixaVazia } from './icones.jsx'

function CartaoCicloForaDoIntervalo({ variante, dataInicio, dataFim }) {
  const conteudo = {
    antes: {
      Icone: IconeCalendario,
      titulo: 'O ciclo ainda não começou',
      texto: `Este ciclo começa em ${dataInicio}.`,
    },
    depois: {
      Icone: IconeBandeira,
      titulo: 'Este ciclo já terminou',
      texto: `O ciclo terminou em ${dataFim}. Carregue um novo ciclo para continuar.`,
    },
    semAmanha: {
      Icone: IconeCaixaVazia,
      titulo: 'Sem dado para amanhã',
      texto: 'Amanhã está fora do ciclo carregado.',
    },
  }[variante]

  if (!conteudo) return null
  const { Icone } = conteudo

  return (
    <div className="rounded-xl border border-dashed border-grafite/20 p-6 text-center dark:border-giz/20">
      <Icone className="mx-auto h-6 w-6 text-grafite/40 dark:text-giz/40" />
      <div className="mt-2 font-display text-xl tracking-wide text-grafite dark:text-giz">{conteudo.titulo}</div>
      <p className="mt-1 text-sm text-grafite/60 dark:text-giz/60">{conteudo.texto}</p>
    </div>
  )
}

export default CartaoCicloForaDoIntervalo
