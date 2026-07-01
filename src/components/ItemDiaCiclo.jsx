import { obterEstiloTreino } from '../lib/estiloTreino.js'
import { hojeLocal, localParaDataISO } from '../lib/datas.js'

function ItemDiaCiclo({ registro }) {
  const estilo = obterEstiloTreino(registro.tipo)
  const ehHoje = registro.dataValida && registro.dataISO === localParaDataISO(hojeLocal())

  return (
    <li
      className={
        'flex gap-3 border-b border-slate-100 px-3 py-3 last:border-0 ' +
        (ehHoje ? 'bg-indigo-50/70' : '')
      }
    >
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${estilo.ponto}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="truncate">
            {registro.dia} · {registro.dataTexto} · {registro.fase}
          </span>
          {ehHoje && (
            <span className="shrink-0 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
              HOJE
            </span>
          )}
          {!registro.dataValida && (
            <span className="shrink-0 text-xs font-semibold text-amber-600" title="data não reconhecida">
              ⚠ data inválida
            </span>
          )}
        </div>
        <div className="font-semibold text-slate-800">{registro.tipo}</div>
        <p className="line-clamp-2 text-sm text-slate-600">{registro.treino}</p>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
          <span>⏱️ {registro.tempo} min</span>
          <span>RPE {registro.rpe}</span>
          {registro.forca && <span>🏋️ Força</span>}
        </div>
      </div>
    </li>
  )
}

export default ItemDiaCiclo
