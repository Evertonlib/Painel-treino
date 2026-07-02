/**
 * Trilho de fases do ciclo (Transição → Desenvolvimento → …). Diferente de
 * um numerador genérico "01/02/03": a ordem aqui é real — são as fases da
 * periodização pelas quais o ciclo passa, nessa sequência.
 */
function FaseCiclo({ fases, faseAtual }) {
  if (!fases || fases.length < 2) return null

  const indiceAtual = fases.indexOf(faseAtual)

  return (
    <div className="flex items-center gap-1.5" aria-label={`Fase atual: ${faseAtual}`}>
      {fases.map((fase, indice) => {
        const passada = indice < indiceAtual
        const atual = indice === indiceAtual
        return (
          <div key={fase} className="flex flex-1 items-center gap-1.5">
            <div className="flex-1">
              <div
                className={
                  'h-1 rounded-full ' +
                  (atual
                    ? 'bg-pista'
                    : passada
                      ? 'bg-grafite/30 dark:bg-giz/30'
                      : 'bg-grafite/10 dark:bg-giz/10')
                }
              />
              <span
                className={
                  'mt-1 block truncate text-[10px] font-medium uppercase tracking-wide ' +
                  (atual ? 'text-pista' : 'text-grafite/40 dark:text-giz/40')
                }
              >
                {fase}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FaseCiclo
