function ItemDiaCiclo({ registro }) {
  return (
    <li className="flex flex-col gap-1 border-b border-gray-200 py-3 px-2">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {registro.dia} · {registro.dataTexto} · {registro.fase}
        </span>
        {!registro.dataValida && (
          <span className="text-amber-600 text-xs font-semibold" title="data não reconhecida">
            ⚠ data não reconhecida
          </span>
        )}
      </div>
      <div className="font-semibold text-gray-800">{registro.tipo}</div>
      <p className="text-sm text-gray-700">{registro.treino}</p>
      <div className="flex gap-4 text-xs text-gray-500">
        <span>Tempo: {registro.tempo} min</span>
        <span>RPE: {registro.rpe}</span>
        {registro.forca && <span>Força: {registro.forca}</span>}
      </div>
    </li>
  )
}

export default ItemDiaCiclo
