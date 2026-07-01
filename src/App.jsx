import { useEffect, useState } from 'react'
import { carregarCiclo as carregarCicloArmazenado } from './lib/armazenamentoLocal.js'
import { hojeLocal, amanhaLocal, localParaDataISO } from './lib/datas.js'
import TelaCarregarCiclo from './components/TelaCarregarCiclo.jsx'
import BotaoCarregarCiclo from './components/BotaoCarregarCiclo.jsx'
import CartaoTreino from './components/CartaoTreino.jsx'
import CartaoCicloForaDoIntervalo from './components/CartaoCicloForaDoIntervalo.jsx'
import ListaCicloCompleto from './components/ListaCicloCompleto.jsx'
import MensagemErro from './components/MensagemErro.jsx'

function ordenarRegistros(registros) {
  const validos = registros
    .filter((registro) => registro.dataValida)
    .sort((a, b) => a.dataISO.localeCompare(b.dataISO))
  const invalidos = registros.filter((registro) => !registro.dataValida)
  return [...validos, ...invalidos]
}

function ConteudoPrincipal({ registrosValidos }) {
  const inicio = registrosValidos[0]
  const fim = registrosValidos[registrosValidos.length - 1]

  const hojeISO = localParaDataISO(hojeLocal())
  const amanhaISO = localParaDataISO(amanhaLocal())

  if (hojeISO < inicio.dataISO) {
    return (
      <CartaoCicloForaDoIntervalo variante="antes" dataInicio={inicio.dataTexto} />
    )
  }
  if (hojeISO > fim.dataISO) {
    return (
      <CartaoCicloForaDoIntervalo variante="depois" dataFim={fim.dataTexto} />
    )
  }

  const registroHoje = registrosValidos.find((r) => r.dataISO === hojeISO)
  const registroAmanha = registrosValidos.find((r) => r.dataISO === amanhaISO)

  return (
    <div className="flex flex-col gap-4">
      <CartaoTreino rotulo="Hoje" registro={registroHoje} />
      {registroAmanha ? (
        <CartaoTreino rotulo="Amanhã" registro={registroAmanha} />
      ) : (
        <CartaoCicloForaDoIntervalo variante="semAmanha" />
      )}
    </div>
  )
}

function App() {
  const [ciclo, setCiclo] = useState(undefined)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    setCiclo(carregarCicloArmazenado())
  }, [])

  function handleCicloCarregado(cicloSalvo) {
    setErro(null)
    setCiclo(cicloSalvo)
  }

  if (ciclo === undefined) return null

  if (ciclo === null) {
    return <TelaCarregarCiclo onCicloCarregado={handleCicloCarregado} />
  }

  const registrosOrdenados = ordenarRegistros(ciclo.registros)
  const registrosValidos = registrosOrdenados.filter((r) => r.dataValida)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg"
              aria-hidden="true"
            >
              🏃
            </span>
            <h1 className="text-lg font-bold text-slate-800">Treino do Dia</h1>
          </div>
          <BotaoCarregarCiclo
            texto="Carregar/atualizar ciclo"
            onCarregado={handleCicloCarregado}
            onErro={setErro}
            className="rounded-full bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors active:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
          />
        </div>
      </header>

      <main className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-5">
        <MensagemErro mensagem={erro} />

        {registrosValidos.length === 0 ? (
          <MensagemErro mensagem="Este ciclo não tem nenhuma data válida. Carregue um arquivo de ciclo válido." />
        ) : (
          <ConteudoPrincipal registrosValidos={registrosValidos} />
        )}

        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">
            Ciclo completo
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ListaCicloCompleto registros={registrosOrdenados} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
