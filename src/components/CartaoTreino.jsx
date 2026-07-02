import { obterEstiloTreino } from '../lib/estiloTreino.js'
import { IconeCronometro, IconeHalter } from './icones.jsx'
import ReguaZona from './ReguaZona.jsx'

function ehDiaOff(tipo) {
  return typeof tipo === 'string' && tipo.trim().toUpperCase().startsWith('OFF')
}

function Chip({ children, icone: Icone }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-grafite/5 px-2.5 py-1 font-mono text-xs font-medium text-grafite/70 ring-1 ring-grafite/10 dark:bg-giz/5 dark:text-giz/70 dark:ring-giz/10">
      {Icone && <Icone className="h-3.5 w-3.5" />}
      {children}
    </span>
  )
}

function CartaoTreino({ rotulo, registro, destaque = false }) {
  if (!registro) return null

  const off = ehDiaOff(registro.tipo)
  const estilo = obterEstiloTreino(registro.tipo)

  return (
    <div className="relative overflow-hidden rounded-xl border border-grafite/10 bg-giz-soft dark:border-giz/10 dark:bg-grafite-soft">
      <div className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: estilo.cor }} aria-hidden="true" />

      <div className="p-4 pl-5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={
              'inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wideish ' +
              (destaque ? 'bg-pista text-giz' : 'border border-pista/40 text-pista')
            }
          >
            {rotulo}
          </span>
          <span className="truncate font-mono text-[11px] text-grafite/50 dark:text-giz/50">
            {registro.dia} · {registro.dataTexto} · {registro.fase}
          </span>
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          {estilo.comForca && <IconeHalter className="h-5 w-5 shrink-0" style={{ color: estilo.cor }} />}
          <h3
            className="truncate font-display text-[1.75rem] leading-none tracking-wide"
            style={{ color: off ? undefined : estilo.cor }}
          >
            {off ? 'Descanso' : registro.tipo}
          </h3>
        </div>

        {estilo.posicaoRegua && (
          <div className="mt-3">
            <ReguaZona posicao={estilo.posicaoRegua} />
          </div>
        )}

        <p className="mt-3 text-sm leading-relaxed text-grafite/80 dark:text-giz/80">{registro.treino}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Chip icone={IconeCronometro}>{registro.tempo} min</Chip>
          <Chip>RPE {registro.rpe}</Chip>
        </div>

        {registro.forca && (
          <div className="mt-3 rounded-lg border border-zona-forca/25 bg-zona-forca/5 px-3 py-2 text-xs leading-relaxed text-grafite/80 dark:text-giz/80">
            <span className="font-mono font-semibold uppercase tracking-wide text-zona-forca">Força ·</span>{' '}
            {registro.forca}
          </div>
        )}
      </div>
    </div>
  )
}

export default CartaoTreino
