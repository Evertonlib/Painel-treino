import ItemDiaCiclo from './ItemDiaCiclo.jsx'

function ListaCicloCompleto({ registros }) {
  return (
    <ul className="flex flex-col">
      {registros.map((registro, indice) => (
        <ItemDiaCiclo key={indice} registro={registro} />
      ))}
    </ul>
  )
}

export default ListaCicloCompleto
