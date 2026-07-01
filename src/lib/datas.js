function pad2(n) {
  return String(n).padStart(2, '0')
}

export function parseDataBR(texto) {
  if (typeof texto !== 'string') return { valida: false }

  const partes = texto.trim().split('/')
  if (partes.length !== 3) return { valida: false }

  const [diaStr, mesStr, anoStr] = partes
  if (!/^\d+$/.test(diaStr) || !/^\d+$/.test(mesStr) || !/^\d+$/.test(anoStr)) {
    return { valida: false }
  }

  const dia = Number(diaStr)
  const mes = Number(mesStr)
  const anoCurto = Number(anoStr)

  if (dia < 1 || dia > 31 || mes < 1 || mes > 12) return { valida: false }
  if (anoStr.length !== 2) return { valida: false }

  const ano = 2000 + anoCurto

  const data = new Date(ano, mes - 1, dia)
  const bateComInformado =
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia

  if (!bateComInformado) return { valida: false }

  return { valida: true, dataISO: `${ano}-${pad2(mes)}-${pad2(dia)}` }
}

export function hojeLocal() {
  const agora = new Date()
  return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())
}

export function dataISOParaLocal(dataISO) {
  const [ano, mes, dia] = dataISO.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

export function localParaDataISO(data) {
  return `${data.getFullYear()}-${pad2(data.getMonth() + 1)}-${pad2(data.getDate())}`
}

export function amanhaLocal() {
  const hoje = hojeLocal()
  return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1)
}
