import { obterEstiloTreino } from '../lib/estiloTreino.js'

function ehDiaOff(tipo) {
  return typeof tipo === 'string' && tipo.trim().toUpperCase().startsWith('OFF')
}

function CartaoTreino({ rotulo, registro }) {
  if (!registro) return null

  const off = ehDiaOff(registro.tipo)
  const estilo = obterEstiloTreino(registro.tipo)

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm dark:bg-slate-900 dark:shadow-none ${estilo.destaque}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${estilo.acento}`} />

      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          {rotulo}
        </span>
        <span className="truncate text-xs font-medium text-slate-400 dark:text-slate-500">
          {registro.dia} · {registro.dataTexto} · {registro.fase}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <span className="text-2xl leading-none" aria-hidden="true">
          {estilo.icone}
        </span>
        <div
          className={`text-lg font-bold ${off ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}
        >
          {off ? 'Dia de descanso' : registro.tipo}
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{registro.treino}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${estilo.badge}`}>
          ⏱️ {registro.tempo} min
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
          RPE {registro.rpe}
        </span>
      </div>

      {registro.forca && (
        <div className="mt-3 rounded-lg border border-violet-100 bg-violet-50/60 px-3 py-2 text-xs text-violet-800 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300">
          <span className="font-semibold">🏋️ Força:</span> {registro.forca}
        </div>
      )}
    </div>
  )
}

export default CartaoTreino
