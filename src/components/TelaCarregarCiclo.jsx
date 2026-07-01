import { useState } from 'react'
import BotaoCarregarCiclo from './BotaoCarregarCiclo.jsx'
import MensagemErro from './MensagemErro.jsx'

function TelaCarregarCiclo({ onCicloCarregado }) {
  const [erro, setErro] = useState(null)

  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-1 px-6 text-center">
      <h1 className="text-2xl font-bold">Treino do Dia</h1>
      <p className="text-gray-600">
        Selecione o arquivo CSV do seu ciclo de treino para começar.
      </p>
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
