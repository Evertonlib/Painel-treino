# PRD — Sanfona de Semanas no Ciclo Completo

## Objetivo

Hoje a seção "Ciclo completo" do Painel-treino mostra todos os dias do ciclo
em uma lista única e corrida (`src/App.jsx:113-120`, renderizando
`ListaCicloCompleto.jsx:1-13`, que por sua vez repete `ItemDiaCiclo.jsx` para
cada linha do CSV, sem nenhuma separação visual entre semanas). Em ciclos
longos (ex.: Buenos Aires, 14 semanas = ~98 linhas) isso obriga a rolar a
tela inteira para localizar um treino específico.

Esta melhoria agrupa a lista do ciclo completo em **cartões por semana**,
que abrem e fecham (padrão "sanfona"/acordeão), adaptando para o
Painel-treino a mesma ideia já implementada e em uso no app irmão
Despertar_BA26. O objetivo é só reorganizar a navegação da lista — nenhum
dado novo é calculado, nenhuma lógica de hoje/amanhã/fase é alterada.

## Relação com os scripts existentes

O Painel-treino é um projeto React + Vite + Tailwind, sem backend; todo o
ciclo vem de um CSV carregado pela usuária e fica em `localStorage`
(`README.md:1-8`, `src/lib/armazenamentoLocal.js:1-26`). Esta melhoria não
cria nenhum script novo, não adiciona dependência nova e não muda o formato
do CSV nem as colunas obrigatórias (`fase,data,dia,tipo,treino,tempo,rpe,forca`,
`README.md:19-30`). Ela mexe exclusivamente na camada de apresentação da
lista "Ciclo completo" já existente, mais uma função nova e pequena de
agrupamento por semana.

### O que já existe hoje no Painel-treino (ponto de partida)

- **Não existe toggle "Esta Semana" / "Ciclo Completo"** no Painel-treino.
  A tela principal sempre mostra, nesta ordem fixa: os cartões "Hoje" e
  "Amanhã" (`ConteudoPrincipal`, `src/App.jsx:33-61`), o indicador de fases
  (`FaseCiclo.jsx`), e logo abaixo, sempre visível, a seção "Ciclo completo"
  com a lista inteira (`src/App.jsx:113-120`).
- **Não existe noção de "semana" nos dados.** O registro normalizado de cada
  linha do CSV (`src/lib/modeloCiclo.js:17-31`) tem os campos `fase`,
  `dataTexto`, `dataISO`, `dataValida`, `dia`, `tipo`, `treino`, `tempo`,
  `rpe`, `forca`, `feito`, `notaSensacao` — nenhum campo de número de semana.
  O CSV também não traz essa coluna (`README.md:19-30`).
- A ordenação atual (`ordenarRegistros`, `src/App.jsx:13-19`) coloca primeiro
  todos os registros com `dataValida === true`, ordenados por `dataISO`, e
  **depois** todos os registros com data inválida, sem ordenação entre eles.
  Essa regra precisa continuar valendo dentro do novo agrupamento por semana.
- `ItemDiaCiclo.jsx` já é o componente de linha usado na lista hoje: barra
  colorida por zona, data, dia da semana, fase, tipo, tempo/RPE, descrição
  do treino truncada em uma linha, badge "Hoje" (destacado com
  `bg-pista/5` quando `ehHoje`, `ItemDiaCiclo.jsx:11-14`) e indicador de
  "data inválida" (`ItemDiaCiclo.jsx:1-55`). Ele deve ser **reaproveitado
  sem alteração** dentro de cada cartão de semana — não existe motivo para
  recriar essa linha. O projeto já tem outro precedente de destacar "o item
  atual" com a cor Pista (`FaseCiclo.jsx:22-27`, fase atual com `bg-pista`),
  o que serve de referência de estilo para destacar a semana atual (ver
  "O que será adicionado").
- `PRD_APP_TREINO_DO_DIA.md:95-97` registra apenas que a exigência do script
  gerador do CSV (fora deste repositório) de que "o total de linhas seja
  múltiplo de 7" **não se aplica ao app**, e que o app deve funcionar
  normalmente com uma última semana/fase incompleta (menos de 7 dias). Esse
  trecho não define nem descreve como calcular um número de semana — ele só
  mostra que o domínio já tolera ciclos cujo total não é múltiplo de 7, o
  que é compatível com (mas não é a fonte de) o critério de agrupamento por
  blocos de 7 dias proposto nesta melhoria, copiado do Despertar_BA26 (ver
  seção abaixo).

### Como o Despertar_BA26 resolveu o mesmo problema (referência, somente leitura)

O Despertar_BA26 é um app estático (HTML/CSS/JS vanilla, sem build,
`c:\Users\maste\Github\Despertar_BA26\index.html`), mas resolve exatamente
este problema:

- **Semana é calculada, não lida do CSV.** A função `deriveWeeksAndTarget`
  ordena os registros válidos por data e, a partir da primeira data do
  ciclo, calcula `r.w = Math.floor((ms - firstMs) / 86400000 / 7) + 1` para
  cada um (`index.html:293-301`) — ou seja, blocos fixos de 7 dias
  corridos, numerados a partir de 1, começando no primeiro dia válido do
  ciclo carregado. Linhas com data inválida são descartadas antes desse
  cálculo (`index.html:271-272`), então nunca recebem número de semana. A
  diferença em dias é sempre calculada contra a **primeira data válida**,
  não contra a posição da linha na lista — excluir uma linha inválida no
  meio do ciclo não desloca a semana de nenhuma outra linha.
- **Toggle de abas.** Dois botões, "Esta Semana" e "Ciclo Completo"
  (`index.html:512-515`), controlam qual conteúdo aparece abaixo: a aba
  "Esta Semana" mostra só os dias da semana atual em formato de lista plana
  (`index.html:517-547`); a aba "Ciclo Completo" mostra todas as semanas
  como cartões sanfona (`index.html:573-610`).
- **Cartão por semana (sanfona).** Para cada semana (`Object.keys(byW)`,
  agrupado por `r.w`, `index.html:453`), um botão de cabeçalho mostra
  "Semana N" e uma seta (▲ aberto / ▼ fechado) e alterna a abertura ao
  clicar (`togAcc`, `index.html:423-428` e `index.html:579-583`). O corpo,
  quando aberto, lista os dias daquela semana (`index.html:584-605`).
- **Abertura independente, não exclusiva.** O estado de abertura é um
  objeto `expanded` com uma entrada por número de semana
  (`expanded[w] = !cur`, `index.html:426`); mais de uma semana pode ficar
  aberta ao mesmo tempo — não é um acordeão que fecha as outras ao abrir
  uma nova.
- **A semana aberta por padrão NÃO é "a semana que contém hoje" — é a
  semana do próximo treino (`getHero()`).** `cw = getHero()?.w ?? ...`
  (`index.html:450`), e `getHero()` devolve o treino de **amanhã** (se não
  for OFF) ou, senão, o primeiro registro com data **maior que hoje**
  (`index.html:368-373`):
  ```
  function getHero() {
    const tmr = tomorrow();
    const ts = S.find(s => s.date === tmr);
    if(ts && !isOffTipo(ts.tipo)) return ts;
    return S.find(s => s.date > today());
  }
  ```
  Consequência: no **último dia de uma semana**, o Despertar já abre por
  padrão a semana **seguinte** (porque o "próximo treino" cai na semana de
  amanhã), não a semana do dia de hoje. Se não houver nenhum "próximo
  treino" (`hero` nulo — ciclo já terminou), `cw` cai para a semana do
  **último** registro do ciclo (`index.html:450`, `index.html:424`), então
  a última semana abre por padrão. O caso "hoje antes do início do ciclo"
  não aparece isolado no Despertar: nesse app, `getHero()` ainda encontra
  um "próximo treino" (o primeiro dia do ciclo, que é `> hoje`), então `cw`
  acaba sendo a semana 1.
- **Tab inicial.** A variável global `tab` começa como `"semana"`
  (`index.html:317`) e volta para `"semana"` toda vez que um novo ciclo é
  confirmado (`index.html:416`) — ou seja, a aba "Esta Semana" é o padrão
  ao carregar/trocar o ciclo.
- **Estado em memória, não persistido.** Tanto `tab` quanto `expanded` são
  variáveis JavaScript comuns, reiniciadas a cada carregamento de página —
  não são salvas em `localStorage`.
- **Dentro do cartão de semana, três comportamentos que vão além de só
  "mostrar a lista daquela semana":**
  1. **Dias OFF são filtrados e não aparecem no corpo do cartão**:
     `const days = byW[wk].filter(s=>!isOffTipo(s.tipo))` (`index.html:578`,
     também usado na aba "Ciclo Completo sem semana derivável",
     `index.html:551`).
  2. **Dias passados ficam esmaecidos**: `opacity:${past?.32:1}`, onde
     `past = s.date < td` (`index.html:587` e `591`).
  3. **O cabeçalho da semana atual (`cw`) tem destaque visual próprio**:
     classe `.acc-btn.cur` em vez de `.acc-btn.nor`
     (`index.html:577` e `581`), com fundo/borda/texto diferentes definidos
     em CSS (`.acc-btn.cur{background:var(--superficie-destaque);
     border-color:var(--borda-destaque);color:var(--giz);}`,
     `index.html:121-122`).
- **Estilo do cartão de semana** (classes CSS `index.html:119-135`): botão
  de cabeçalho (`.acc-btn`) com cantos arredondados que mudam conforme
  aberto/fechado, corpo (`.acc-body`) com fundo levemente diferente do
  cartão e itens (`.acc-item`) separados por borda fina. A seta é só texto
  (`▲`/`▼`), não um ícone SVG.

### O que precisa ser adaptado (diferenças entre os dois apps)

| Aspecto | Despertar_BA26 | Painel-treino | Adaptação necessária |
|---|---|---|---|
| Stack | HTML/JS vanilla, string de HTML montada em `render()` | React 19 + Vite + Tailwind, componentes `.jsx` | Reescrever a lógica como componente(s) React com `useState`, sem copiar a técnica de template string |
| Campo de semana | Calculado em `deriveWeeksAndTarget` e guardado em `r.w` | Não existe | Criar uma função equivalente (ex. em `src/lib/modeloCiclo.js` ou em um novo arquivo `src/lib/semanas.js`), aplicada só sobre os registros com `dataValida === true`, ordenados por `dataISO` |
| Linha do dia dentro do cartão | Linha compacta própria (`.acc-item`), sem texto descritivo do treino, sem dias OFF, com dias passados esmaecidos | `ItemDiaCiclo.jsx` já existente, mais rica (inclui `treino`, badge "Hoje", badge "data inválida"), sem filtro de OFF nem esmaecimento de dias passados | Reaproveitar `ItemDiaCiclo.jsx` sem recriar o visual do Despertar — ver "Fora do escopo" abaixo sobre o filtro de OFF e o esmaecimento |
| Semana aberta por padrão | Semana do **próximo treino** (`hero.w`, amanhã ou o primeiro dia futuro) — não a semana de hoje | Painel-treino não tem conceito de "hero"; o cartão de destaque é o de **Hoje** (`ConteudoPrincipal`, `src/App.jsx:47-52`) | Desvio deliberado do Despertar: abrir por padrão a semana que contém o dia de **hoje** (não "amanhã"/"próximo treino"), por ser o destaque natural já existente no Painel-treino — ver premissa 7 |
| Destaque visual da semana atual | Cabeçalho com classe `.acc-btn.cur` (`index.html:121-122`, `577`, `581`) | Não existe ainda, mas o projeto já tem o precedente de destacar "o atual" com a cor Pista (`ItemDiaCiclo.jsx:11-14`, `FaseCiclo.jsx:22-27`) | Incluído no escopo — ver "O que será adicionado" |
| Toggle "Esta Semana"/"Ciclo Completo" | Controla o que aparece abaixo do cartão de destaque, substituindo uma visão pela outra | Painel-treino já sempre mostra "Hoje"/"Amanhã" acima da seção "Ciclo completo" (não é substituído por aba) | Decisão em aberto — ver "Perguntas em aberto" abaixo |
| Registros com data inválida | Descartados antes de calcular semana (nunca aparecem em lugar nenhum) | Exibidos na lista hoje, ao final, com badge "inválida" (`ItemDiaCiclo.jsx:31-36`) | Manter esses registros visíveis (não descartar), mas fora da numeração de semanas — ver critérios de aceitação |
| Ícone de seta do cabeçalho | Caractere de texto `▲`/`▼` | `src/components/icones.jsx` tem um padrão de ícones SVG só com os já existentes | Mais simples reaproveitar o padrão do Despertar (texto `▲`/`▼`), evitando criar um ícone SVG novo sem necessidade |

### Fora do escopo (comportamentos do Despertar que não são replicados)

- **Filtrar dias OFF para fora do cartão de semana** (`index.html:578`):
  fica **fora do escopo** desta melhoria. `ItemDiaCiclo.jsx` é reaproveitado
  sem alteração, e hoje ele não tem lógica de filtrar OFF — exibir ou
  esconder dias de descanso é uma mudança de conteúdo, não de navegação, e
  está fora do objetivo deste PRD (só reorganizar em semanas). Se isso for
  desejado no futuro, é uma melhoria separada.
- **Esmaecer (`opacity`) dias passados dentro do cartão aberto**
  (`index.html:587-591`): também fica **fora do escopo**, pelo mesmo
  motivo — é uma mudança visual de `ItemDiaCiclo.jsx`, componente que este
  PRD reaproveita integralmente sem alterar.
- **Destaque visual do cabeçalho da semana atual** (equivalente a
  `.acc-btn.cur`): **este, ao contrário dos dois acima, fica dentro do
  escopo** (ver "O que será adicionado"). A diferença é que aqui não exige
  tocar em `ItemDiaCiclo.jsx` nem mudar o que é exibido — é só um estilo a
  mais no cabeçalho do cartão novo (`CartaoSemana.jsx`), e o projeto já
  tem precedente direto de destacar "o item atual" com a cor Pista em dois
  lugares (`ItemDiaCiclo.jsx:11-14` e `FaseCiclo.jsx:22-27`), então é
  barato e consistente incluir aqui.

## Arquivos afetados

| Arquivo | O que muda |
|---|---|
| `src/lib/modeloCiclo.js` (ou novo `src/lib/semanas.js`) | Nova função que recebe os registros válidos já ordenados por `dataISO` e devolve o número da semana (bloco de 7 dias a partir do primeiro registro válido) de cada um, e/ou já devolve os registros agrupados por semana. |
| `src/components/ListaCicloCompleto.jsx` | Deixa de renderizar uma `<ul>` plana com todos os registros; passa a agrupar por semana e renderizar um cartão sanfona por semana (novo componente), mais uma seção separada para os registros de data inválida. |
| Novo componente (proposta de nome: `src/components/CartaoSemana.jsx`) | Cartão sanfona de uma semana: cabeçalho clicável com rótulo "Semana N", destaque visual quando é a semana atual, e seta de aberto/fechado; corpo que — quando aberto — lista os dias daquela semana reaproveitando `ItemDiaCiclo.jsx`. |
| `src/App.jsx` | Se a decisão (ver perguntas em aberto) for adicionar o toggle "Esta Semana"/"Ciclo Completo", a seção "Ciclo completo" (`src/App.jsx:113-120`) ganha os dois botões de aba e passa a alternar entre as duas visões. Se a decisão for manter só a sanfona sem o toggle, este arquivo não muda. |
| `DESIGN_SYSTEM.md` | Opcional: documentar o novo padrão visual de cartão sanfona (cabeçalho de semana, estado aberto/fechado, destaque da semana atual), seguindo o mesmo nível de detalhe já usado para o Cartão de Treino (`DESIGN_SYSTEM.md:226-267`). |

## O que será adicionado

- Agrupamento dos registros válidos do ciclo em semanas de 7 dias corridos,
  numeradas a partir de 1, contadas a partir da primeira data válida do
  ciclo carregado (mesmo critério de cálculo já usado pelo Despertar_BA26,
  `index.html:293-301`).
- Um cartão por semana na seção "Ciclo completo", com cabeçalho mostrando
  "Semana N" e uma seta indicando se está aberto ou fechado.
- Comportamento de abrir/fechar independente por semana (mais de uma semana
  pode ficar aberta ao mesmo tempo), sem exigir biblioteca de acordeão —
  apenas estado React local (`useState`).
- Abertura automática, por padrão, da semana que contém a **data de hoje**
  (quando hoje está dentro do intervalo do ciclo). Este é um **desvio
  deliberado** em relação ao Despertar_BA26, que abre por padrão a semana
  do "próximo treino" (amanhã ou o primeiro dia futuro, `getHero()`,
  `index.html:368-373`) — no último dia de uma semana, isso faria o
  Despertar abrir a semana seguinte. O Painel-treino não tem o conceito de
  "hero": seu cartão de destaque já é o de **Hoje** (`ConteudoPrincipal`,
  `src/App.jsx:47-52`), então abrir a semana de hoje é o comportamento
  equivalente e mais natural aqui.
- Destaque visual no cabeçalho da semana atual (a que contém a data de
  hoje), reaproveitando a cor Pista já usada para marcar "o atual" em
  outros pontos do app (`ItemDiaCiclo.jsx:11-14`, `FaseCiclo.jsx:22-27`).
- Reaproveitamento integral de `ItemDiaCiclo.jsx` como a linha de cada dia
  dentro do cartão de semana — nenhuma mudança no visual de cada linha
  (inclusive dias OFF continuam aparecendo e dias passados não são
  esmaecidos — ver "Fora do escopo").
- Uma seção separada (sem numeração de semana) para registros com data
  inválida, mantendo o comportamento atual de exibi-los em vez de
  escondê-los (`ItemDiaCiclo.jsx:31-36`).

## O que será removido

- A renderização atual de `ListaCicloCompleto.jsx` como uma única lista
  corrida sem agrupamento (`ListaCicloCompleto.jsx:1-13` é substituído pela
  versão agrupada por semana). O componente `ItemDiaCiclo.jsx` em si não é
  removido nem alterado, só passa a ser chamado de dentro do novo cartão de
  semana em vez de diretamente da lista.
- Nenhum dado, campo do CSV, ou lógica de cálculo existente é removido.

## O que não será tocado

- **Lógica de hoje/amanhã e fases**: `ConteudoPrincipal` (`src/App.jsx:33-61`),
  `CartaoTreino.jsx`, `CartaoCicloForaDoIntervalo.jsx`, `FaseCiclo.jsx` — a
  melhoria é só na seção "Ciclo completo", abaixo dessas.
- **Parsing e validação do CSV**: `src/lib/parseCsv.js`,
  `src/lib/modeloCiclo.js` (além da função nova de semana, nenhum campo
  existente é alterado ou removido), `README.md:19-30` (formato do CSV não
  muda — nenhuma coluna de semana é exigida no arquivo).
- **Armazenamento**: `src/lib/armazenamentoLocal.js`, chave
  `treinoDoDia:ciclo:v1` — o objeto salvo no `localStorage` não precisa
  guardar o número de semana; ele pode continuar sendo calculado em tempo
  de exibição a partir dos registros já salvos.
- **Cores e regra de zona**: `src/lib/estiloTreino.js`, `ReguaZona.jsx`.
- **`ItemDiaCiclo.jsx`**: reaproveitado como está, sem alterações no seu
  próprio código (portanto sem filtro de dias OFF e sem esmaecimento de
  dias passados dentro do cartão de semana — ver "Fora do escopo").
- **Qualquer arquivo do projeto Despertar_BA26**, usado aqui apenas como
  referência de leitura — nenhum arquivo lá é alterado.
- **Formato do CSV e script gerador** (fora deste repositório): nenhuma
  coluna nova é exigida; a regra de "múltiplo de 7" continua sendo só uma
  convenção do gerador, não uma validação do app (`PRD_APP_TREINO_DO_DIA.md:95-97`).

## Premissas assumidas

1. **"Semana" é um conceito calculado, não uma coluna do CSV.** Segue
   exatamente o critério já usado no Despertar_BA26: bloco de 7 dias
   corridos a partir da primeira data válida do ciclo, numerado a partir de
   1 (`index.html:293-301`). Não depende de o ciclo ter exatamente
   múltiplos de 7 linhas — uma última semana incompleta (ex.: 3 dias)
   continua sendo tratada como uma semana normal, só com menos cartões
   dentro.
2. **A numeração de semana é recalculada a cada renderização**, a partir
   dos registros válidos já carregados — não é salva como campo novo no
   `localStorage`, evitando qualquer migração do formato salvo hoje
   (`armazenamentoLocal.js`).
3. **Registros com data inválida não entram em nenhuma semana numerada.**
   Eles continuam aparecendo (não são escondidos), em uma seção à parte,
   sem número de semana — do mesmo jeito que hoje ficam ao final da lista
   (`ordenarRegistros`, `src/App.jsx:13-19`).
4. **O estado de aberto/fechado de cada cartão de semana não é persistido**
   entre recarregamentos da página — reinicia sempre no padrão (semana de
   hoje aberta) a cada vez que o app é aberto, igual ao princípio do
   Despertar_BA26 (estado só em memória), embora o critério de "qual semana
   é essa por padrão" seja diferente (ver premissa 7).
5. **A seta de aberto/fechado é só texto (`▲`/`▼`)**, como no Despertar_BA26,
   em vez de um ícone SVG novo em `icones.jsx` — mais simples e evita
   aumentar o arquivo de ícones sem necessidade.
6. **Mais de um cartão de semana pode ficar aberto ao mesmo tempo** (não é
   um acordeão exclusivo que fecha os outros automaticamente), replicando o
   comportamento do Despertar_BA26.
7. **A semana aberta por padrão é a semana de hoje, não a semana do
   "próximo treino".** O Despertar_BA26 abre por padrão a semana de
   `getHero()` (amanhã, ou o primeiro dia futuro — `index.html:368-373`),
   o que o faz abrir a semana seguinte no último dia de cada semana. Como o
   Painel-treino não tem esse conceito de "hero" e já destaca o dia de hoje
   como cartão principal (`src/App.jsx:47-52`), assume-se que a semana
   aberta por padrão é a que contém a data de hoje. Isso é um desvio
   deliberado do comportamento do Despertar, não um erro de leitura dele.

## Riscos identificados

- **Lista muito longa de qualquer forma, se muitas semanas ficarem abertas
  ao mesmo tempo.** Como a abertura não é exclusiva, a usuária pode abrir
  todas as semanas e voltar ao problema original de rolagem longa. Mitigação
  natural: o padrão é abrir só a semana atual: a usuária decide se quer
  abrir mais.
- **Semana calculada pode não bater com a identidade de "semana de treino"
  pretendida pela planilha de origem**, caso o ciclo real tenha sido
  pensado com início de semana em um dia específico (ex.: sempre
  começando numa segunda-feira) e a primeira linha do CSV carregado não
  caia exatamente nesse dia. Como o cálculo usa sempre a primeira data do
  CSV como início da "semana 1", isso é equivalente ao que o Despertar_BA26
  já faz, mas vale confirmar que essa é a expectativa certa (ver perguntas
  em aberto).

## Perguntas em aberto (decisão do Everton)

1. **O toggle "Esta Semana" / "Ciclo Completo" do card do Trello deve ser
   implementado literalmente, mesmo o Painel-treino já mostrando sempre os
   cartões "Hoje"/"Amanhã" acima da seção "Ciclo completo"?** Duas opções
   possíveis: (a) manter a seção "Ciclo completo" sempre visível como hoje,
   só com os cartões de semana dentro dela (sem toggle novo) — mais simples,
   menos mudança de estrutura; ou (b) adicionar de fato os dois botões de
   aba acima da seção, onde "Esta Semana" mostra uma lista plana só da
   semana atual (sem cartões sanfona) e "Ciclo Completo" mostra as semanas
   em cartões sanfona — replicando o Despertar_BA26 com mais fidelidade.
   Este PRD assume a opção (a) como caminho mais simples, mas pode ser
   ajustado para (b) antes do Spec.
2. **Qual semana deve abrir por padrão quando a data de hoje está ANTES do
   início do ciclo** (cenário já tratado hoje por
   `CartaoCicloForaDoIntervalo`, variante "antes", `src/App.jsx:40-41`)? O
   Despertar_BA26 não tem esse mesmo cenário de forma isolada (lá, o
   "próximo treino" sempre aponta para o primeiro dia do ciclo nesse caso,
   então a semana 1 abre). Confirmar se a semana 1 deve abrir por padrão
   neste caso no Painel-treino também, ou se deve ficar tudo fechado por
   padrão.
3. **Qual semana deve abrir por padrão quando a data de hoje está DEPOIS do
   fim do ciclo** (`CartaoCicloForaDoIntervalo`, variante "depois",
   `src/App.jsx:43-44`)? O Despertar_BA26 abre a última semana nesse caso
   (`index.html:450`). Confirmar se esse é o comportamento desejado aqui.
4. **O rótulo "Semana N" é suficiente, ou a usuária prefere algum outro
   texto** (ex.: incluir o intervalo de datas da semana, tipo "Semana 3 ·
   15–21 jan")? O Despertar_BA26 usa só "Semana N" (`index.html:457`).
5. **Filtrar dias OFF e/ou esmaecer dias passados dentro do cartão de
   semana (como o Despertar_BA26 faz) são desejados para uma iteração
   futura, ou o comportamento atual de `ItemDiaCiclo.jsx` (mostrar OFF, sem
   esmaecer) deve continuar valendo indefinidamente dentro dos cartões de
   semana?** Este PRD assume que não — ambos ficam fora de escopo (ver
   "Fora do escopo").

## Critérios de aceitação

Cada cenário abaixo descreve uma entrada e o resultado esperado.

1. **Ciclo curto, menos de 7 dias de treino**
   Entrada: um ciclo carregado tem só 4 linhas com data válida, todas dentro
   dos primeiros 7 dias a partir da primeira data.
   Resultado esperado: a seção "Ciclo completo" mostra um único cartão de
   semana ("Semana 1"), contendo as 4 linhas; nenhum cartão vazio de semana
   extra é exibido.

2. **Ciclo longo com várias semanas (ex.: 14 semanas)**
   Entrada: um ciclo carregado tem 98 linhas com data válida, cobrindo 14
   blocos de 7 dias.
   Resultado esperado: a seção "Ciclo completo" mostra 14 cartões de
   semana, numerados "Semana 1" a "Semana 14", em ordem cronológica, cada
   um contendo exatamente os 7 dias correspondentes.

3. **Última semana incompleta (menos de 7 dias)**
   Entrada: um ciclo carregado tem um total de linhas que não é múltiplo de
   7, deixando a última semana com, por exemplo, só 3 dias.
   Resultado esperado: o último cartão de semana é exibido normalmente,
   contendo somente os dias existentes daquela semana (3, nesse exemplo),
   sem erro e sem exigir que o total seja múltiplo de 7.

4. **Hoje cai dentro do ciclo — semana de hoje abre automaticamente**
   Entrada: a data de hoje corresponde a uma linha de uma das semanas do
   meio do ciclo (ex.: Semana 6 de 14), incluindo o caso de hoje ser o
   **último dia** dessa semana.
   Resultado esperado: ao abrir o app, o cartão da Semana 6 (a que contém a
   data de hoje) já aparece aberto por padrão e com destaque visual no
   cabeçalho — mesmo quando hoje é o último dia da Semana 6 (não deve abrir
   a Semana 7 por padrão nesse caso); os demais cartões de semana aparecem
   fechados por padrão, mas continuam clicáveis.

5. **Abrir e fechar um cartão de semana manualmente**
   Entrada: a usuária toca no cabeçalho de um cartão de semana fechado.
   Resultado esperado: o cartão expande e mostra os dias daquela semana; a
   seta do cabeçalho muda de indicar "fechado" para "aberto". Tocar
   novamente no mesmo cabeçalho fecha o cartão de volta, sem afetar o
   estado de nenhum outro cartão de semana.

6. **Mais de uma semana aberta ao mesmo tempo**
   Entrada: a usuária abre manualmente a Semana 2 enquanto a Semana 6 (de
   hoje) já está aberta por padrão.
   Resultado esperado: as duas semanas (2 e 6) ficam visíveis abertas
   simultaneamente; abrir uma não fecha a outra automaticamente.

7. **Conteúdo de cada dia dentro do cartão de semana**
   Entrada: um cartão de semana está aberto, contendo tanto dias de treino
   quanto dias OFF, e tanto dias futuros quanto dias já passados.
   Resultado esperado: cada dia daquela semana é exibido com os mesmos
   campos e estilo já usados hoje na lista do ciclo completo (barra
   colorida por zona, data, dia da semana, fase, tipo, tempo/RPE, descrição
   do treino, badge "Hoje" quando aplicável) — sem nenhuma informação a
   menos nem a mais em relação ao que `ItemDiaCiclo.jsx` já mostra
   atualmente; dias OFF continuam aparecendo normalmente na lista e dias
   passados não ficam esmaecidos.

8. **Registro com data inválida em meio ao ciclo**
   Entrada: o ciclo carregado tem uma ou mais linhas com data inválida
   (fora do padrão `dd/mm/aa`), misturadas com linhas válidas.
   Resultado esperado: as linhas com data válida continuam agrupadas
   normalmente em cartões de semana numerados, sem nenhum deslocamento de
   número de semana causado pela linha inválida; as linhas com data
   inválida continuam sendo exibidas (não desaparecem), reunidas numa área
   separada sem número de semana, mantendo o badge "inválida" que já existe
   hoje.

9. **Ciclo com todas as datas inválidas**
   Entrada: nenhuma linha do CSV carregado tem data válida (caso já coberto
   hoje por "Este ciclo não tem nenhuma data válida", `src/App.jsx:108`).
   Resultado esperado: nenhum cartão de semana é exibido (não há como
   calcular semana sem nenhuma data válida); o comportamento de mensagem de
   erro já existente para esse caso continua valendo sem mudança.

10. **Hoje antes do início do ciclo**
    Entrada: a data de hoje é anterior à primeira data do ciclo carregado.
    Resultado esperado: a seção "Ciclo completo" continua acessível e
    agrupada em cartões de semana; qual cartão abre por padrão segue a
    decisão tomada na pergunta em aberto 2 deste PRD — mas em nenhum caso o
    app deve travar, ficar em branco, ou deixar de mostrar os cartões de
    semana.

11. **Hoje depois do fim do ciclo**
    Entrada: a data de hoje é posterior à última data do ciclo carregado.
    Resultado esperado: a seção "Ciclo completo" continua acessível e
    agrupada em cartões de semana; o cartão da última semana abre por
    padrão (conforme pergunta em aberto 3), sem erro nem tela em branco.

12. **Carregar um novo ciclo substitui o agrupamento anterior**
    Entrada: a usuária troca o ciclo carregado pelo botão "Atualizar"
    (`BotaoCarregarCiclo`), carregando um CSV diferente.
    Resultado esperado: os cartões de semana são recalculados do zero a
    partir do novo ciclo (nova "Semana 1" a partir da primeira data do novo
    CSV); nenhum resquício de numeração ou estado de abertura do ciclo
    anterior permanece visível.

13. **Nenhuma mudança no comportamento de hoje/amanhã/fases**
    Entrada: qualquer ciclo válido carregado, antes e depois desta
    melhoria.
    Resultado esperado: os cartões "Hoje" e "Amanhã", o indicador de fases
    e os estados de "ciclo não começou"/"ciclo terminado" continuam
    funcionando exatamente como antes — a melhoria não altera nada acima da
    seção "Ciclo completo".

14. **Cenário de erro — cartão de semana sem nenhum dia**
    Entrada: por algum erro de cálculo, uma semana numerada ficaria sem
    nenhum registro associado.
    Resultado esperado: esse cartão de semana vazio não deve ser exibido —
    só são exibidos cartões de semanas que de fato têm ao menos um
    registro de data válida.

15. **Cenário de erro — build de produção**
    Entrada: comando `npm run build` executado após a implementação.
    Resultado esperado: o build conclui sem erros, e o app publicado em
    `dist/` exibe a seção "Ciclo completo" já agrupada em cartões de
    semana, sem regressão visual nas demais telas.
