function ehDiaOff(tipo) {
  return typeof tipo === 'string' && tipo.trim().toUpperCase().startsWith('OFF')
}

function CartaoTreino({ rotulo, registro }) {
  if (!registro) return null

  const off = ehDiaOff(registro.tipo)

  return (
    <div
      className={
        'rounded-xl border p-4 shadow-sm ' +
        (off ? 'bg-gray-100 border-gray-300' : 'bg-white border-blue-200')
      }
    >
      <div className="text-sm font-semibold text-gray-500 uppercase">
        {rotulo}
      </div>
      <div className="text-xs text-gray-500 mb-2">
        {registro.dia} · {registro.dataTexto} · {registro.fase}
      </div>

      {off ? (
        <div className="text-lg font-bold text-gray-600 mb-1">
          Dia de descanso
        </div>
      ) : (
        <div className="text-lg font-bold text-blue-700 mb-1">
          {registro.tipo}
        </div>
      )}

      <p className="text-gray-800 mb-2">{registro.treino}</p>

      <div className="flex gap-4 text-sm text-gray-600">
        <span>Tempo: {registro.tempo} min</span>
        <span>RPE: {registro.rpe}</span>
      </div>
      {registro.forca && (
        <p className="text-sm text-gray-600 mt-1">Força: {registro.forca}</p>
      )}
    </div>
  )
}

export default CartaoTreino
