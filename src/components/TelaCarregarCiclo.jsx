import { useState } from 'react'
import BotaoCarregarCiclo from './BotaoCarregarCiclo.jsx'
import MensagemErro from './MensagemErro.jsx'

function TelaCarregarCiclo({ onCicloCarregado }) {
  const [erro, setErro] = useState(null)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gradient-to-b from-indigo-50 via-white to-white px-6 text-center">
      <span
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-3xl shadow-lg shadow-indigo-200"
        aria-hidden="true"
      >
        🏃
      </span>
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Treino do Dia</h1>
        <p className="mt-2 max-w-xs text-sm text-slate-500">
          Selecione o arquivo CSV do seu ciclo de treino para ver o treino de hoje e de amanhã.
        </p>
      </div>
      <BotaoCarregarCiclo
        texto="Selecionar arquivo CSV"
        onCarregado={(ciclo) => {
          setErro(null)
          onCicloCarregado(ciclo)
        }}
        onErro={setErro}
      />
      <MensagemErro mensagem={erro} />
    </div>
  )
}

export default TelaCarregarCiclo
