import { obterEstiloTreino } from '../lib/estiloTreino.js'
import { hojeLocal, localParaDataISO } from '../lib/datas.js'
import { IconeAlerta } from './icones.jsx'

function ItemDiaCiclo({ registro }) {
  const estilo = obterEstiloTreino(registro.tipo)
  const ehHoje = registro.dataValida && registro.dataISO === localParaDataISO(hojeLocal())

  return (
    <li
      className={
        'flex gap-3 border-b border-grafite/10 px-3 py-2.5 last:border-0 dark:border-giz/10 ' +
        (ehHoje ? 'bg-pista/5' : '')
      }
    >
      <span
        className="mt-0.5 w-1 shrink-0 self-stretch rounded-full"
        style={{ backgroundColor: estilo.cor }}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-grafite/50 dark:text-giz/50">
          <span className="font-tabular">{registro.dataTexto}</span>
          <span>{registro.dia}</span>
          <span className="truncate text-grafite/35 dark:text-giz/35">{registro.fase}</span>
          {ehHoje && (
            <span className="ml-auto shrink-0 rounded bg-pista px-1.5 py-0.5 text-[10px] font-semibold uppercase text-giz">
              Hoje
            </span>
          )}
          {!registro.dataValida && (
            <span className="ml-auto flex shrink-0 items-center gap-1 text-amber-600" title="data não reconhecida">
              <IconeAlerta className="h-3 w-3" />
              inválida
            </span>
          )}
        </div>

        <div className="mt-0.5 flex items-baseline justify-between gap-2">
          <span className="truncate font-display text-lg leading-tight tracking-wide" style={{ color: estilo.cor }}>
            {registro.tipo}
          </span>
          <span className="shrink-0 font-mono font-tabular text-xs text-grafite/60 dark:text-giz/60">
            {registro.tempo}min · RPE {registro.rpe}
          </span>
        </div>

        <p className="line-clamp-1 text-xs text-grafite/60 dark:text-giz/60">{registro.treino}</p>
      </div>
    </li>
  )
}

export default ItemDiaCiclo
