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
    <div className="flex flex-col gap-6 p-4 max-w-xl mx-auto">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Treino do Dia</h1>
        <BotaoCarregarCiclo
          texto="Carregar/atualizar ciclo"
          onCarregado={handleCicloCarregado}
          onErro={setErro}
          className="text-sm rounded-lg bg-blue-600 text-white font-semibold px-3 py-2 active:bg-blue-700"
        />
      </header>

      <MensagemErro mensagem={erro} />

      {registrosValidos.length === 0 ? (
        <MensagemErro mensagem="Este ciclo não tem nenhuma data válida. Carregue um arquivo de ciclo válido." />
      ) : (
        <ConteudoPrincipal registrosValidos={registrosValidos} />
      )}

      <section>
        <h2 className="text-lg font-semibold mb-2">Ciclo completo</h2>
        <ListaCicloCompleto registros={registrosOrdenados} />
      </section>
    </div>
  )
}

export default App
