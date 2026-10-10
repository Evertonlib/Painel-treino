# SPEC — Sanfona de Semanas no Ciclo Completo

Baseado em `PRD_SANFONA_SEMANAS.md` (aprovado em 10/10/2026). As decisões da seção
"Decisões do Everton" do PRD prevalecem sobre as "premissas assumidas" e perguntas em aberto:
sem abas; hoje antes do ciclo abre a Semana 1; hoje depois do ciclo abre a última semana;
rótulo somente "Semana N"; filtro de dias OFF e esmaecimento de dias passados fora do escopo.

## Verificação do código atual (pré-implementação)

Conferido por leitura direta dos arquivos listados como afetados no PRD.

- `src/App.jsx:13-19` — `ordenarRegistros`: válidos ordenados por `dataISO` (`localeCompare`),
  depois inválidos, na ordem original. Bate com o PRD.
- `src/App.jsx:82-83` — `registrosOrdenados` (válidos + inválidos) e `registrosValidos`.
- `src/App.jsx:107-111` — se `registrosValidos.length === 0`, mostra `MensagemErro` ("Este ciclo
  não tem nenhuma data válida..."); a seção "Ciclo completo" continua sendo renderizada mesmo
  assim (`src/App.jsx:113-120`), recebendo todos os registros inválidos. Bate com o PRD
  (critério 9), com o detalhe de que hoje a lista de inválidos aparece nesse caso.
- `src/App.jsx:117-119` — o contêiner `overflow-hidden rounded-xl border ... bg-giz-soft
  dark:bg-grafite-soft` envolve `<ListaCicloCompleto registros={registrosOrdenados} />`.
  O contêiner continua valendo; os cartões de semana ficam dentro dele.
- `src/components/ListaCicloCompleto.jsx:1-13` — `<ul>` plana, `key={indice}`. Bate.
- `src/components/ItemDiaCiclo.jsx:5-52` — é um `<li>`; calcula `ehHoje` por conta própria
  (linha 7) e usa `bg-pista/5` (linhas 11-14); badge "inválida" nas linhas 31-36;
  `last:border-0` na borda inferior (linha 12). **Consequência para o Spec:** o corpo do cartão
  de semana precisa ser um `<ul>` para o `<li>` ser válido, e cada `<ul>` terá seu próprio
  "último item" sem borda. Reaproveitado sem nenhuma alteração.
- `src/components/FaseCiclo.jsx:22-27` — fase atual com `bg-pista` / `text-pista` (linha 32).
  Precedente de estilo para o destaque da semana atual. Bate.
- `src/lib/datas.js` — `hojeLocal`, `localParaDataISO` (linhas 36 e 46), `dataISOParaLocal`
  (linha 41). `parseDataBR` exige ano de 2 dígitos e valida o calendário.
- `src/lib/modeloCiclo.js:17-31` — campos do registro normalizado; `dataISO` é `null` quando a
  data é inválida. Não há campo de semana. Bate.
- `src/lib/armazenamentoLocal.js:4-13` — `salvarCiclo` grava `carregadoEm: new Date().toISOString()`
  a cada carga. **Isso não está no PRD**, mas é a chave natural para reiniciar o estado ao trocar
  de ciclo (critério 12). Fluxo de troca: `BotaoCarregarCiclo.jsx:32` chama `salvarCiclo`,
  e `handleCicloCarregado` (`src/App.jsx:71-74`) faz `setCiclo(cicloSalvo)`.
- `tailwind.config.js:18` (`pista`) e `:39` (`wideish`) existem; `giz`, `grafite` e variantes
  `-soft`/`-dark` já são usados em `ItemDiaCiclo.jsx` e `App.jsx`.
- `package.json:6-12` — scripts `dev`, `build`, `lint` (oxlint), `preview`. Não há framework de
  testes; a verificação é por `node` (função pura), `lint`, `build` e conferência visual.
- Não existe `CLAUDE.md` na raiz do Painel-treino (nem o arquivo é mencionado no PRD).

### Observações sobre diferenças PRD x código

1. O PRD diz que `src/App.jsx` não muda sem o toggle. **O código exige uma alteração mínima de
   uma linha** em `src/App.jsx:118` (adicionar `key={ciclo.carregadoEm}` ao
   `ListaCicloCompleto`) para cumprir o critério 12. Sem ela, o `useState` dos cartões
   sobreviveria à troca de ciclo, pois o componente não é desmontado. O código prevalece.
2. Referência do Despertar: `.acc-btn.cur` está em `index.html:122` (o PRD cita 121-122,
   incluindo a linha de comentário/abertura `.acc-btn`, 120-121). Sem impacto.
3. No Despertar, a abertura padrão é `isOpen = w => expanded.hasOwnProperty(w) ? expanded[w] : w===cw`
   (`Despertar_BA26/index.html:454`). Aqui o equivalente é estado inicial calculado uma única vez
   (seção "Estado de abertura"), com o desvio deliberado de `cw` = semana que contém hoje.
4. O cálculo do Despertar usa `T00:00:00Z` (`index.html:297,299`) para evitar problema de horário
   de verão. No Painel-treino o equivalente é `Date.UTC(ano, mes-1, dia)` a partir do `dataISO`.

## Arquitetura da solução

Por que assim: manter a "semana" como cálculo puro em um arquivo novo e pequeno (fácil de testar
com `node`), um componente de cartão sem estado próprio, e o estado de abertura em um único lugar
(`ListaCicloCompleto`), que decide o padrão uma vez e é recriado quando o ciclo muda.

```
App.jsx  ──(key = ciclo.carregadoEm)──▶  ListaCicloCompleto (useState: semanas abertas)
                                              ├─ CartaoSemana (1 por semana, controlado)
                                              │     └─ <ul> ▶ ItemDiaCiclo (inalterado)
                                              └─ seção "inválidas" (<ul> ▶ ItemDiaCiclo)
```

Arquivos:

| Arquivo | Ação |
|---|---|
| `src/lib/semanas.js` | **Novo.** Funções puras de semana (sem React). |
| `src/components/CartaoSemana.jsx` | **Novo.** Cabeçalho clicável + corpo. |
| `src/components/ListaCicloCompleto.jsx` | **Reescrito.** Agrupa, guarda estado, renderiza. |
| `src/App.jsx` | **Uma linha** (:118): `key`. |
| `DESIGN_SYSTEM.md` | Documentar nova seção 3.7 (opcional no PRD; última task). |

Não tocados: `ItemDiaCiclo.jsx`, `FaseCiclo.jsx`, `modeloCiclo.js`, `parseCsv.js`,
`armazenamentoLocal.js`, `estiloTreino.js`, `ConteudoPrincipal`, `vite.config.js`, CSV.

## 1. `src/lib/semanas.js` (novo)

Importa apenas de `./datas.js` se necessário (a lógica de diferença de dias usa `Date.UTC`
direto sobre o texto `AAAA-MM-DD`, então pode nem importar).

Assinaturas:

```js
// Dias corridos entre duas datas ISO (AAAA-MM-DD), usando Date.UTC (imune a horário de verão).
function diasEntre(dataISOInicio, dataISOFim) // => number inteiro (pode ser negativo)

// Número da semana (1, 2, ...) de uma data ISO em relação à primeira data do ciclo.
// = Math.floor(diasEntre(primeiraISO, dataISO) / 7) + 1   (mesma regra do Despertar, index.html:300)
export function numeroDaSemana(dataISO, primeiraISO)

// Agrupa em semanas só os registros com dataValida === true.
// Entrada: qualquer lista de registros (válidos e inválidos misturados, ordem livre).
// Saída: [{ numero, registros }] em ordem crescente de numero; cada registros em ordem de dataISO.
// Só inclui semanas com ao menos um registro (critério 14).
// Lista sem nenhum válido => [].
export function agruparPorSemana(registros)

// Semana que CONTÉM hoje: devolve o numero se hojeISO está entre a primeira e a última
// data do ciclo e existe cartão com esse numero; senão null.
export function semanaAtual(semanas, hojeISO)

// Semana a abrir por padrão (decisões do PRD):
//   hoje dentro do ciclo        => semanaAtual (se não null)
//   hoje antes da primeira data => numero da primeira semana (Semana 1)
//   hoje depois da última data  => numero da última semana
//   semanas vazias              => null
export function semanaAbertaPadrao(semanas, hojeISO)
```

Regras de implementação:

- `agruparPorSemana`: filtrar `registro.dataValida` (e `dataISO` não nulo); ordenar uma cópia por
  `dataISO.localeCompare` (mesma ordenação de `src/App.jsx:16`; ordenação estável mantém a ordem
  original do CSV em datas iguais); `primeiraISO` = `dataISO` do primeiro; agrupar com um `Map`
  `numero -> registros`; devolver array em ordem de inserção (já crescente). Não cria semana
  sem registros porque só nascem semanas a partir de registros existentes.
- Datas duplicadas ou buracos entre datas (ex.: 10 dias sem linha) não quebram: o `numero` vem
  da distância em dias, então pode haver salto de numeração (Semana 3 → Semana 5) e **a semana
  intermediária simplesmente não aparece** (critério 14). Registrar como limitação conhecida;
  não é esperado em CSVs reais, pois o gerador produz linhas diárias contíguas.
- `semanaAtual`: com `semanas` vazio, `null`. Primeira data = `semanas[0].registros[0].dataISO`;
  última = último registro da última semana. Se `hojeISO < primeira` ou `hojeISO > última`,
  `null`. Senão calcula `numeroDaSemana(hojeISO, primeira)` e devolve-o se `semanas.some(...)`
  tiver esse `numero`; caso contrário `null` (buraco no ciclo: nenhuma semana abre, sem erro).
- `semanaAbertaPadrao`: `semanas` vazio => `null`; `hojeISO < primeira` => `semanas[0].numero`;
  `hojeISO > última` => `semanas[semanas.length-1].numero`; dentro => `semanaAtual(...)`.
- Data inválida: nunca entra em `agruparPorSemana`, logo nunca recebe número e não desloca nenhum
  outro (a base é sempre a primeira data **válida**). Ciclo sem data válida => `[]` => nenhuma
  função quebra (`semanaAtual` e `semanaAbertaPadrao` devolvem `null`).
- Última semana incompleta: nenhum tratamento especial; o `Map` simplesmente tem menos registros
  (critérios 1 e 3).

## 2. `src/components/CartaoSemana.jsx` (novo)

Assinatura:

```jsx
function CartaoSemana({ numero, registros, aberta, atual, onAlternar })
export default CartaoSemana
```

- Componente controlado, sem `useState`. `onAlternar` é chamado sem argumentos; o pai já fecha
  sobre o `numero` (`() => alternar(numero)`).
- Estrutura:

```jsx
<div className="border-b border-grafite/10 last:border-0 dark:border-giz/10">
  <button type="button" onClick={onAlternar} aria-expanded={aberta} className="...">
    <span>Semana {numero}</span>
    <span aria-hidden="true">{aberta ? '▲' : '▼'}</span>
  </button>
  {aberta && (
    <ul className="flex flex-col">
      {registros.map((registro, indice) => <ItemDiaCiclo key={indice} registro={registro} />)}
    </ul>
  )}
</div>
```

- Classes do botão (base): `flex w-full items-center justify-between px-3 py-2.5 text-left
  font-mono text-xs font-semibold uppercase tracking-wideish transition-colors
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pista`.
- Normal: `text-grafite/60 dark:text-giz/60`.
- **Atual** (`atual === true`): `bg-pista/10 text-pista` (mesma cor Pista usada para "o atual" em
  `FaseCiclo.jsx:23,32` e `ItemDiaCiclo.jsx:13`). Pelo menos "Semana N" continua legível nos
  dois temas; conferir contraste na verificação visual.
- Seta: texto `▲`/`▼` (PRD, premissa 5), `text-[10px]`, com `aria-hidden`. O estado aberto/fechado
  para leitor de tela vai em `aria-expanded`.
- Corpo desmontado quando fechado (simples; evita renderizar ~98 itens fechados).
- Rótulo: somente `Semana {numero}` (decisão 4). Sem datas.
- O `border-b ... last:border-0` do `div` raiz evita linha dupla com a borda do contêiner de
  `src/App.jsx:117` quando a última semana está fechada.

## 3. `src/components/ListaCicloCompleto.jsx` (reescrito)

Assinatura mantida: `function ListaCicloCompleto({ registros })` (recebe `registrosOrdenados`,
válidos + inválidos, como hoje em `src/App.jsx:118`).

Lógica (em ordem):

1. `const hojeISO = localParaDataISO(hojeLocal())` (imports de `../lib/datas.js`).
2. `const semanas = agruparPorSemana(registros)`.
3. `const invalidos = registros.filter((r) => !r.dataValida)`.
4. `const atual = semanaAtual(semanas, hojeISO)` (usada só para o destaque; `null` quando hoje
   está fora do intervalo).
5. `const [abertas, setAbertas] = useState(() => { const padrao = semanaAbertaPadrao(semanas, hojeISO); return new Set(padrao === null ? [] : [padrao]) })`.
   O inicializador roda só na montagem. Os hooks vêm antes de qualquer `return` (não há retorno
   antecipado antes deles).
6. `function alternar(numero)`: `setAbertas((anterior) => { const proximo = new Set(anterior); proximo.has(numero) ? proximo.delete(numero) : proximo.add(numero); return proximo })`.
   Cada semana é independente (premissa 6, critério 6); nenhuma outra é fechada.

Render:

```jsx
<div className="flex flex-col">
  {semanas.map((semana) => (
    <CartaoSemana key={semana.numero} numero={semana.numero} registros={semana.registros}
      aberta={abertas.has(semana.numero)} atual={semana.numero === atual}
      onAlternar={() => alternar(semana.numero)} />
  ))}
  {invalidos.length > 0 && (
    <div className="border-b border-grafite/10 last:border-0 dark:border-giz/10">
      <p className="px-3 py-2.5 font-mono text-xs font-semibold uppercase tracking-wideish text-grafite/40 dark:text-giz/40">Sem data válida</p>
      <ul className="flex flex-col">{invalidos.map((registro, indice) => <ItemDiaCiclo key={indice} registro={registro} />)}</ul>
    </div>
  )}
</div>
```

- A seção de inválidos é sempre visível (não é sanfona), sem numeração de semana; o texto
  "Sem data válida" é um título curto sugerido por este Spec (o PRD pede apenas "seção separada
  sem número de semana"). O badge "inválida" vem do próprio `ItemDiaCiclo.jsx:31-36`.
- Ciclo sem nenhuma data válida (critério 9): `semanas = []`, nenhum cartão de semana; só a seção
  de inválidos (comportamento atual preservado) e a `MensagemErro` de `src/App.jsx:108`.
- Se `registros` vazio: renderiza `<div>` vazio (igual ao `<ul>` vazio de hoje).

### Reinício do estado ao trocar de ciclo (critério 12)

Em `src/App.jsx:118`, trocar para:

```jsx
<ListaCicloCompleto key={ciclo.carregadoEm} registros={registrosOrdenados} />
```

`carregadoEm` é gerado em cada `salvarCiclo` (`src/lib/armazenamentoLocal.js:7`) e vem em
`cicloSalvo` até `setCiclo` (`src/App.jsx:71-74`); ao recarregar a página também existe, pois
`carregarCiclo` devolve o objeto salvo inteiro (`armazenamentoLocal.js:15-25`). Chave diferente
=> React desmonta e remonta o componente => `useState` recalcula o padrão a partir do novo ciclo,
sem resquício do anterior. Ciclos antigos salvos sem `carregadoEm` não existem (o campo faz parte
da versão 1 desde `salvarCiclo`); se algum viesse `undefined`, o `key` seria `undefined` e o
componente apenas não reiniciaria — risco aceito e coberto pela verificação manual.

## 4. Casos de borda (resumo e tratamento)

| Caso (PRD) | Tratamento |
|---|---|
| Data inválida (crit. 8) | Fora de `agruparPorSemana`; vai para a seção "Sem data válida"; não desloca semanas. |
| Ciclo sem data válida (crit. 9) | `semanas=[]`; sem cartões; `padrao=null`; mensagem de erro de `App.jsx:108` inalterada. |
| Última semana incompleta (crit. 1, 3) | Cartão normal com menos linhas. |
| Hoje antes do ciclo (crit. 10) | `semanaAbertaPadrao` = Semana 1 aberta; sem destaque (`semanaAtual` = `null`). |
| Hoje depois do ciclo (crit. 11) | Última semana aberta; sem destaque. |
| Hoje no último dia da semana (crit. 4) | `numeroDaSemana(hoje)` usa a data de hoje, não a de amanhã; abre a semana de hoje. |
| Semana sem registros (crit. 14) | Nunca criada; semana com buraco no ciclo simplesmente não aparece. |
| Hoje dentro do intervalo mas em buraco | Nenhuma semana abre por padrão e nenhuma tem destaque; usuária abre manualmente. |
| Trocar de ciclo (crit. 12) | `key={ciclo.carregadoEm}`. |

Decisão deste Spec: o **destaque** do cabeçalho vale só quando a semana de fato contém hoje
(PRD: "a que contém a data de hoje"). Quando hoje está fora do ciclo, a semana abre por padrão
mas não é destacada.

## Verificação pós-implementação

1. `node` sobre `src/lib/semanas.js` (módulo ESM puro; rodar com `node --input-type=module`)
   cobrindo: 4 linhas (1 semana); 98 linhas (14 semanas); 17 linhas (3ª semana com 3);
   inválida no meio (numeração igual à do ciclo sem ela); só inválidas (`[]`);
   `semanaAbertaPadrao` com hoje no último dia da semana 6 (deve dar 6), antes (1), depois (última).
2. `npm run lint` sem erros novos.
3. `npm run build` sem erros (critério 15).
4. Conferência visual com `npm run dev` e CSVs de teste: abrir/fechar, duas semanas abertas,
   destaque Pista nos dois temas, ciclo trocado via "Atualizar" (estado reiniciado), cartões
   "Hoje"/"Amanhã"/fases inalterados (critério 13).

## Plano de Execução

- [x] Task 1 — Criar `src/lib/semanas.js` com `numeroDaSemana` e `agruparPorSemana` (blocos de 7
      dias a partir da primeira data válida; só registros válidos; ignora semanas vazias).
- [x] Task 2 — Em `src/lib/semanas.js`, adicionar `semanaAtual` e `semanaAbertaPadrao` (hoje dentro
      = semana de hoje; antes = primeira; depois = última; sem semanas = `null`).
- [x] Task 3 — Testar as funções da `semanas.js` com `node` (os cenários da seção "Verificação
      pós-implementação", item 1), sem criar arquivo de teste no repositório.
- [x] Task 4 — Criar `src/components/CartaoSemana.jsx` (cabeçalho-botão "Semana N" com seta
      `▲`/`▼`, `aria-expanded`, destaque Pista quando `atual`, corpo `<ul>` com `ItemDiaCiclo`
      só quando `aberta`).
- [x] Task 5 — Reescrever `src/components/ListaCicloCompleto.jsx`: agrupar, estado `Set` de semanas
      abertas (padrão via `semanaAbertaPadrao`), renderizar `CartaoSemana` por semana e a seção
      "Sem data válida" para os inválidos.
- [x] Task 6 — Em `src/App.jsx:118`, adicionar `key={ciclo.carregadoEm}` ao `ListaCicloCompleto`
      (reinício do estado ao trocar de ciclo).
- [x] Task 7 — Rodar `npm run lint` e corrigir qualquer aviso introduzido.
- [x] Task 8 — Rodar `npm run build` e confirmar conclusão sem erros.
- [ ] Task 9 — Verificação visual manual com `npm run dev` (critérios 1 a 14 aplicáveis na tela;
      incluir tema claro/escuro e troca de ciclo pelo botão "Atualizar").
- [x] Task 10 — Documentar o cartão sanfona em `DESIGN_SYSTEM.md` como nova seção 3.7 (cabeçalho,
      estado aberto/fechado, destaque da semana atual), no nível de detalhe da seção 3.2.

## Desvios

