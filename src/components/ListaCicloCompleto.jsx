import ItemDiaCiclo from './ItemDiaCiclo.jsx'

function ListaCicloCompleto({ registros }) {
  return (
    <ul className="flex flex-col divide-y divide-gray-200">
      {registros.map((registro, indice) => (
        <ItemDiaCiclo key={indice} registro={registro} />
      ))}
    </ul>
  )
}

export default ListaCicloCompleto
