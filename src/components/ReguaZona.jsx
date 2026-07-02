import { CORES_ZONA } from '../lib/estiloTreino.js'

const SEGMENTOS = [1, 2, 3, 4, 5].map((n) => ({ n, cor: CORES_ZONA[`z${n}`] }))

/**
 * Régua Z1→Z5: o elemento-assinatura do app. Mostra onde o esforço do dia
 * cai no espectro real de zonas de treino (não é decoração — é a mesma
 * leitura que a atleta faria numa tabela de zonas de FC/pace).
 */
function ReguaZona({ posicao, compacta = false }) {
  const altura = compacta ? 'h-1.5' : 'h-2.5'

  return (
    <div className="w-full">
      <div className={`flex gap-0.5 ${altura}`}>
        {SEGMENTOS.map(({ n, cor }) => {
          const dentroDaFaixa =
            posicao?.tipo === 'faixa' && n >= posicao.inicio && n <= posicao.fim
          const ehPonto = posicao?.tipo === 'ponto' && posicao.valor === n
          const ativo = dentroDaFaixa || ehPonto
          const atenuado = posicao && !ativo
          return (
            <span
              key={n}
              className="flex-1 rounded-full transition-opacity"
              style={{ backgroundColor: cor, opacity: atenuado ? 0.22 : 1 }}
            />
          )
        })}
      </div>
      {!compacta && (
        <div className="mt-1 flex justify-between font-mono text-[10px] tracking-wide text-grafite/40 dark:text-giz/40">
          <span>Z1</span>
          <span>Z2</span>
          <span>Z3</span>
          <span>Z4</span>
          <span>Z5</span>
        </div>
      )}
    </div>
  )
}

export default ReguaZona
