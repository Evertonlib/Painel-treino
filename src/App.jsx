import { useEffect, useState } from 'react'
import { carregarCiclo as carregarCicloArmazenado } from './lib/armazenamentoLocal.js'
import { hojeLocal, amanhaLocal, localParaDataISO } from './lib/datas.js'
import TelaCarregarCiclo from './components/TelaCarregarCiclo.jsx'
import BotaoCarregarCiclo from './components/BotaoCarregarCiclo.jsx'
import BotaoAlternarTema from './components/BotaoAlternarTema.jsx'
import CartaoTreino from './components/CartaoTreino.jsx'
import CartaoCicloForaDoIntervalo from './components/CartaoCicloForaDoIntervalo.jsx'
import ListaCicloCompleto from './components/ListaCicloCompleto.jsx'
import MensagemErro from './components/MensagemErro.jsx'
import FaseCiclo from './components/FaseCiclo.jsx'
import { IconePista } from './components/icones.jsx'

function ordenarRegistros(registros) {
  const validos = registros
    .filter((registro) => registro.dataValida)
    .sort((a, b) => a.dataISO.localeCompare(b.dataISO))
  const invalidos = registros.filter((registro) => !registro.dataValida)
  return [...validos, ...invalidos]
}

function fasesEmOrdem(registrosValidos) {
  const vistas = new Set()
  const fases = []
  for (const registro of registrosValidos) {
    if (!vistas.has(registro.fase)) {
      vistas.add(registro.fase)
      fases.push(registro.fase)
    }
  }
  return fases
}

function ConteudoPrincipal({ registrosValidos }) {
  const inicio = registrosValidos[0]
  const fim = registrosValidos[registrosValidos.length - 1]

  const hojeISO = localParaDataISO(hojeLocal())
  const amanhaISO = localParaDataISO(amanhaLocal())

  if (hojeISO < inicio.dataISO) {
    return <CartaoCicloForaDoIntervalo variante="antes" dataInicio={inicio.dataTexto} />
  }
  if (hojeISO > fim.dataISO) {
    return <CartaoCicloForaDoIntervalo variante="depois" dataFim={fim.dataTexto} />
  }

  const registroHoje = registrosValidos.find((r) => r.dataISO === hojeISO)
  const registroAmanha = registrosValidos.find((r) => r.dataISO === amanhaISO)

  return (
    <div className="flex flex-col gap-4">
      <CartaoTreino rotulo="Hoje" registro={registroHoje} destaque />
      {registroAmanha ? (
        <CartaoTreino rotulo="Amanhã" registro={registroAmanha} />
      ) : (
        <CartaoCicloForaDoIntervalo variante="semAmanha" />
      )}
      {registroHoje && <FaseCiclo fases={fasesEmOrdem(registrosValidos)} faseAtual={registroHoje.fase} />}
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
    <div className="min-h-screen bg-giz dark:bg-grafite">
      <header className="sticky top-0 z-10 border-b border-grafite/10 bg-giz/90 backdrop-blur dark:border-giz/10 dark:bg-grafite/90">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <IconePista className="h-6 w-6 text-pista" />
            <h1 className="font-display text-xl tracking-wide text-grafite dark:text-giz">Treino do Dia</h1>
          </div>
          <div className="flex items-center gap-2">
            <BotaoAlternarTema />
            <BotaoCarregarCiclo
              texto="Atualizar"
              onCarregado={handleCicloCarregado}
              onErro={setErro}
              className="inline-flex items-center gap-1.5 rounded-lg bg-pista px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wideish text-giz transition-colors active:bg-pista-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pista focus-visible:ring-offset-2 dark:focus-visible:ring-offset-grafite"
            />
          </div>
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
          <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wideish text-grafite/40 dark:text-giz/40">
            Ciclo completo
          </h2>
          <div className="overflow-hidden rounded-xl border border-grafite/10 bg-giz-soft dark:border-giz/10 dark:bg-grafite-soft">
            <ListaCicloCompleto registros={registrosOrdenados} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
