import ItemDiaCiclo from './ItemDiaCiclo.jsx'

function CartaoSemana({ numero, registros, aberta, atual, onAlternar }) {
  return (
    <div className="border-b border-grafite/10 last:border-0 dark:border-giz/10">
      <button
        type="button"
        onClick={onAlternar}
        aria-expanded={aberta}
        className={
          'flex w-full items-center justify-between px-3 py-2.5 text-left font-mono text-xs font-semibold uppercase tracking-wideish transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pista ' +
          (atual ? 'bg-pista/10 text-pista' : 'text-grafite/60 dark:text-giz/60')
        }
      >
        <span>Semana {numero}</span>
        <span className="text-[10px]" aria-hidden="true">
          {aberta ? '▲' : '▼'}
        </span>
      </button>
      {aberta && (
        <ul className="flex flex-col">
          {registros.map((registro, indice) => (
            <ItemDiaCiclo key={indice} registro={registro} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default CartaoSemana
