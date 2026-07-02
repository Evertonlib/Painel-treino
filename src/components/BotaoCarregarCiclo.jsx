import { useRef } from 'react'
import { lerArquivoCsv } from '../lib/parseCsv.js'
import { normalizarCiclo } from '../lib/modeloCiclo.js'
import { salvarCiclo } from '../lib/armazenamentoLocal.js'
import { IconeUpload } from './icones.jsx'

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
          'inline-flex items-center gap-2 rounded-lg bg-pista px-5 py-3 font-mono text-sm font-semibold uppercase tracking-wideish text-giz transition-colors active:bg-pista-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pista focus-visible:ring-offset-2 dark:focus-visible:ring-offset-grafite'
        }
      >
        <IconeUpload className="h-4 w-4" />
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
