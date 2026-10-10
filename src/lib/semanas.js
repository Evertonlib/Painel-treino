const MS_POR_DIA = 86400000

function diasEntre(dataISOInicio, dataISOFim) {
  const [anoI, mesI, diaI] = dataISOInicio.split('-').map(Number)
  const [anoF, mesF, diaF] = dataISOFim.split('-').map(Number)
  const inicio = Date.UTC(anoI, mesI - 1, diaI)
  const fim = Date.UTC(anoF, mesF - 1, diaF)
  return Math.round((fim - inicio) / MS_POR_DIA)
}

export function numeroDaSemana(dataISO, primeiraISO) {
  return Math.floor(diasEntre(primeiraISO, dataISO) / 7) + 1
}

export function agruparPorSemana(registros) {
  const validos = registros
    .filter((registro) => registro.dataValida && registro.dataISO)
    .sort((a, b) => a.dataISO.localeCompare(b.dataISO))
  if (validos.length === 0) return []

  const primeiraISO = validos[0].dataISO
  const porNumero = new Map()
  for (const registro of validos) {
    const numero = numeroDaSemana(registro.dataISO, primeiraISO)
    if (!porNumero.has(numero)) porNumero.set(numero, [])
    porNumero.get(numero).push(registro)
  }
  return [...porNumero].map(([numero, registrosDaSemana]) => ({ numero, registros: registrosDaSemana }))
}

function limites(semanas) {
  const primeira = semanas[0].registros[0].dataISO
  const ultimaSemana = semanas[semanas.length - 1]
  const ultima = ultimaSemana.registros[ultimaSemana.registros.length - 1].dataISO
  return { primeira, ultima }
}

export function semanaAtual(semanas, hojeISO) {
  if (semanas.length === 0) return null
  const { primeira, ultima } = limites(semanas)
  if (hojeISO < primeira || hojeISO > ultima) return null
  const numero = numeroDaSemana(hojeISO, primeira)
  return semanas.some((semana) => semana.numero === numero) ? numero : null
}

export function semanaAbertaPadrao(semanas, hojeISO) {
  if (semanas.length === 0) return null
  const { primeira, ultima } = limites(semanas)
  if (hojeISO < primeira) return semanas[0].numero
  if (hojeISO > ultima) return semanas[semanas.length - 1].numero
  return semanaAtual(semanas, hojeISO)
}
