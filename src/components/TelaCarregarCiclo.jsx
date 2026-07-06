import { useState } from 'react'
import BotaoCarregarCiclo from './BotaoCarregarCiclo.jsx'
import BotaoAlternarTema from './BotaoAlternarTema.jsx'
import MensagemErro from './MensagemErro.jsx'
import { IconePassada } from './icones.jsx'

function TelaCarregarCiclo({ onCicloCarregado }) {
  const [erro, setErro] = useState(null)

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-giz px-6 text-center dark:bg-grafite">
      <div className="absolute right-4 top-4">
        <BotaoAlternarTema />
      </div>

      <IconePassada className="h-12 w-12 text-pista" />

      <div>
        <h1 className="font-display text-4xl tracking-wide text-grafite dark:text-giz">Sistema Ritmo Certo</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-grafite/60 dark:text-giz/60">
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

      <div className="w-full max-w-xs">
        <MensagemErro mensagem={erro} />
      </div>
    </div>
  )
}

export default TelaCarregarCiclo
