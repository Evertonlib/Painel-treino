import { useState } from 'react'
import { hojeLocal, localParaDataISO } from '../lib/datas.js'
import { agruparPorSemana, semanaAtual, semanaAbertaPadrao } from '../lib/semanas.js'
import CartaoSemana from './CartaoSemana.jsx'
import ItemDiaCiclo from './ItemDiaCiclo.jsx'

function ListaCicloCompleto({ registros }) {
  const hojeISO = localParaDataISO(hojeLocal())
  const semanas = agruparPorSemana(registros)
  const invalidos = registros.filter((registro) => !registro.dataValida)
  const atual = semanaAtual(semanas, hojeISO)

  const [abertas, setAbertas] = useState(() => {
    const padrao = semanaAbertaPadrao(semanas, hojeISO)
    return new Set(padrao === null ? [] : [padrao])
  })

  function alternar(numero) {
    setAbertas((anterior) => {
      const proximo = new Set(anterior)
      if (proximo.has(numero)) proximo.delete(numero)
      else proximo.add(numero)
      return proximo
    })
  }

  return (
    <div className="flex flex-col">
      {semanas.map((semana) => (
        <CartaoSemana
          key={semana.numero}
          numero={semana.numero}
          registros={semana.registros}
          aberta={abertas.has(semana.numero)}
          atual={semana.numero === atual}
          onAlternar={() => alternar(semana.numero)}
        />
      ))}
      {invalidos.length > 0 && (
        <div className="border-b border-grafite/10 last:border-0 dark:border-giz/10">
          <p className="px-3 py-2.5 font-mono text-xs font-semibold uppercase tracking-wideish text-grafite/40 dark:text-giz/40">
            Sem data válida
          </p>
          <ul className="flex flex-col">
            {invalidos.map((registro, indice) => (
              <ItemDiaCiclo key={indice} registro={registro} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ListaCicloCompleto
