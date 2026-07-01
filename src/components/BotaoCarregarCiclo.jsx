import { useRef } from 'react'
import { lerArquivoCsv } from '../lib/parseCsv.js'
import { normalizarCiclo } from '../lib/modeloCiclo.js'
import { salvarCiclo } from '../lib/armazenamentoLocal.js'

const MENSAGENS_ERRO = {
  'arquivo vazio ou ilegível':
    'Não foi possível ler este arquivo como um ciclo de treino.',
  'arquivo não tem o formato esperado':
    'Este arquivo não tem o formato esperado de um ciclo de treino.',
}

function mensagemAmigavel(erro) {
  return (
    MENSAGENS_ERRO[erro.message] ||
    'Não foi possível carregar este ciclo de treino.'
  )
}

function BotaoCarregarCiclo({ onCarregado, onErro, texto = 'Carregar ciclo', className = '' }) {
  const inputRef = useRef(null)

  async function handleArquivoSelecionado(evento) {
    const arquivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!arquivo) return

    try {
      const linhasBrutas = await lerArquivoCsv(arquivo)
      const registros = normalizarCiclo(linhasBrutas)
      const cicloSalvo = salvarCiclo({
        nomeArquivoOriginal: arquivo.name,
        registros,
      })
      onCarregado?.(cicloSalvo)
    } catch (erro) {
      console.error('Falha ao carregar ciclo:', erro)
      onErro?.(mensagemAmigavel(erro))
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={
          className ||
          'rounded-lg bg-blue-600 text-white font-semibold px-4 py-3 active:bg-blue-700'
        }
      >
        {texto}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleArquivoSelecionado}
      />
    </>
  )
}

export default BotaoCarregarCiclo
