# SPEC — App Treino do Dia

Especificação técnica derivada exclusivamente do `PRD_APP_TREINO_DO_DIA.md`
aprovado. Este documento não introduz nenhum requisito novo — apenas detalha
como cada ponto do PRD será implementado.

## 1. Estrutura de pastas e arquivos a criar

```
Painel-treino/
├── .gitignore                      (inclui dados_do_ciclo.csv, node_modules, dist — criado ANTES de qualquer outro commit)
├── PRD_APP_TREINO_DO_DIA.md
├── SPEC_APP_TREINO_DO_DIA.md
├── dados_do_ciclo.csv               (fixture local de teste, ignorado pelo Git)
├── index.html
├── package.json
├── vite.config.js                   (base configurada para o caminho do GitHub Pages)
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── manifest.webmanifest         (nome do app, ícones, cor de tema, display: standalone)
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
└── src/
    ├── main.jsx                     (bootstrap do React)
    ├── App.jsx                      (máquina de estados: sem ciclo / ciclo carregado)
    ├── components/
    │   ├── TelaCarregarCiclo.jsx    (tela de "sem dados carregados")
    │   ├── BotaoCarregarCiclo.jsx   (botão sempre visível, abre o seletor de arquivo)
    │   ├── CartaoTreino.jsx         (cartão grande de um dia: usado para "hoje" e "amanhã")
    │   ├── CartaoCicloForaDoIntervalo.jsx  (mensagens: ciclo não começou / ciclo terminou / sem dado para amanhã)
    │   ├── ListaCicloCompleto.jsx   (lista rolável do ciclo inteiro)
    │   ├── ItemDiaCiclo.jsx         (linha da lista, reutilizada por ListaCicloCompleto)
    │   └── MensagemErro.jsx         (banner de erro genérico)
    ├── lib/
    │   ├── parseCsv.js              (leitura do arquivo + parsing tolerante do CSV)
    │   ├── modeloCiclo.js           (normalização de cada linha para o formato interno)
    │   ├── armazenamentoLocal.js    (salvar/carregar/substituir o ciclo no localStorage)
    │   └── datas.js                 (parsing de DD/MM/AA e comparação com a data do celular)
    └── styles/
        └── index.css                (diretivas Tailwind)
```

Assim como no PRD, estes nomes são uma proposta de organização e podem ser
ajustados durante a implementação sem invalidar este Spec, desde que a
separação de responsabilidades abaixo seja mantida.

## 2. Bibliotecas de terceiros

- **PapaParse** — parsing de CSV no navegador, com suporte a autodetecção de
  delimitador (`,` ou `;`) e leitura por cabeçalho nomeado. Evita escrever um
  parser manual, reduzindo risco de bugs em casos de borda (aspas, campos
  com vírgula dentro de texto livre como `treino`).
- **vite-plugin-pwa** (ou equivalente simples) — gera o `manifest.webmanifest`
  e o service worker automaticamente a partir da configuração do Vite,
  evitando escrever um service worker manual à mão.

Nenhuma outra dependência de peso é prevista (sem backend, sem biblioteca de
estado global — `useState`/`useEffect` do React são suficientes dado o
tamanho do app).

## 3. Componentes de tela e o que cada um exibe

- **App.jsx** — componente raiz. Ao montar, tenta carregar um ciclo do
  `localStorage` via `armazenamentoLocal.js`. Mantém o estado
  `estadoApp: 'sem_ciclo' | 'ciclo_carregado'`. Renderiza `TelaCarregarCiclo`
  no primeiro caso, ou a tela principal (cartões de hoje/amanhã +
  `ListaCicloCompleto`) no segundo, sempre com `BotaoCarregarCiclo` visível.

- **TelaCarregarCiclo.jsx** — exibida quando não há ciclo válido salvo
  (primeira abertura ou memória apagada). Mostra uma explicação curta
  ("Selecione o arquivo CSV do seu ciclo de treino") e o controle de seleção
  de arquivo. Exibe `MensagemErro` quando o arquivo selecionado falha na
  validação (cenários 4 e 5 do PRD).

- **BotaoCarregarCiclo.jsx** — botão reutilizável, presente tanto na tela de
  carregamento inicial quanto fixo na tela principal. Abre o seletor de
  arquivo do sistema operacional (`input[type=file]` com `accept=".csv"`) e
  dispara o fluxo: ler arquivo → `parseCsv` → `modeloCiclo` → validar →
  `armazenamentoLocal.salvarCiclo` (substituindo qualquer ciclo anterior) →
  atualizar o estado do `App.jsx`. Em caso de erro em qualquer etapa, o ciclo
  anteriormente salvo (se houver) **não é apagado**.

- **CartaoTreino.jsx** — recebe um rótulo ("Hoje" ou "Amanhã") e um registro
  de dia (ou `null`). Exibe, como estão no CSV: `fase`, `dia` (dia da
  semana), `data`, `tipo`, `treino`, `tempo`, `rpe`, `forca`. Quando
  `tipo === 'OFF'` (ou variantes que comecem com "OFF", como
  "OFF + Estabilidade Core"), aplica um estilo visual diferenciado indicando
  dia de descanso, mas sem tratar isso como ausência de dado — o texto de
  `treino` (ex.: "Descanso total") continua sendo exibido normalmente.

- **CartaoCicloForaDoIntervalo.jsx** — usado em três situações, cada uma com
  uma mensagem própria: (1) data atual anterior à primeira data do ciclo,
  mostrando a data de início; (2) data atual posterior à última data do
  ciclo, mostrando a data de término e sugerindo carregar um novo ciclo; (3)
  "amanhã" cai fora do intervalo carregado (ex.: hoje é o último dia do
  ciclo), mostrando que não há dado para o dia seguinte. Não é um estado de
  erro técnico — é informativo.

- **ListaCicloCompleto.jsx** — recebe todos os registros do ciclo (válidos e
  inválidos) já ordenados cronologicamente e renderiza um `ItemDiaCiclo`
  para cada um, em uma lista rolável, sem paginação (o volume de linhas de
  um ciclo é pequeno o suficiente para renderizar tudo de uma vez).

- **ItemDiaCiclo.jsx** — linha compacta mostrando `fase`, `data`, `dia`,
  `tipo`, `treino` (truncado/expansível se muito longo), `tempo`, `rpe`,
  `forca`. Se a linha tiver data inválida, exibe um indicador visual sutil
  (ex.: ícone ou cor de aviso) e um texto curto do tipo "data não
  reconhecida", mas continua listando os demais campos como estão.

- **MensagemErro.jsx** — componente genérico de banner/alerta usado por
  `TelaCarregarCiclo` para comunicar falhas de leitura/validação do arquivo,
  com texto compreensível para a usuária (não expõe stack trace nem termos
  técnicos).

## 4. Como o CSV será lido e parseado

1. A seleção do arquivo usa um `input[type=file]` nativo do navegador
   (`accept=".csv,text/csv"`), disparado pelo `BotaoCarregarCiclo`. O
   navegador entrega um objeto `File` — o conteúdo é lido inteiramente em
   memória (`File.text()`), sem nenhuma requisição de rede.
2. `parseCsv.js` roda o PapaParse sobre o texto do arquivo com:
   - `header: true` (usa a primeira linha como nomes de coluna);
   - `skipEmptyLines: true`;
   - delimitador em modo de autodetecção (PapaParse detecta `,` ou `;`
     automaticamente quando o delimitador não é fixado).
3. Validação de estrutura, antes de processar qualquer linha:
   - Se o arquivo não gerar nenhuma coluna reconhecida ou nenhuma linha de
     dado → erro "arquivo vazio ou ilegível" (cenário 4 do PRD).
   - Se as colunas detectadas não contiverem
     `fase,data,dia,tipo,treino,tempo,rpe,forca` → erro "arquivo não tem o
     formato esperado", citando a mensagem sem citar quais colunas
     faltam (mensagem final para a usuária é genérica; detalhe técnico pode
     ir ao console para depuração) (cenário 5 do PRD). A comparação é
     **insensível a maiúsculas/minúsculas e a espaços nas bordas** (ex.:
     `Fase`, ` DATA ` ou `Rpe` no cabeçalho são aceitos normalmente); os
     nomes internos usados pelo restante do app permanecem sempre em
     minúsculas, então essa tolerância não exige nenhuma mudança em outro
     lugar do código.
   - Essas duas validações acontecem **antes** de qualquer gravação em
     `localStorage`, garantindo que um ciclo válido anterior nunca seja
     apagado por um arquivo ruim.
4. Se a estrutura for válida, cada linha é passada para
   `modeloCiclo.normalizarLinha(linha)`, que:
   - copia `fase`, `dia`, `tipo`, `treino`, `rpe`, `forca` como texto,
     usando string vazia quando ausentes;
   - converte `tempo` para número; se `Number(...)` resultar em `NaN`
     (texto não numérico, vazio, etc.), usa `0` em vez de rejeitar a linha
     (cenário 7 do PRD);
   - interpreta `data` via `datas.parseDataBR` (seção 5) e guarda tanto o
     texto original quanto o resultado interpretado, marcando a linha como
     `dataValida: true/false`;
   - reserva (sem uso na v1) os campos `feito: null` e `notaSensacao: null`
     para a futura funcionalidade de marcar treino como feito/anotar
     sensação, conforme previsto no PRD.
5. Nenhuma verificação de "múltiplo de 7 linhas" é feita — o ciclo é aceito
   com qualquer quantidade de linhas, incluindo semanas incompletas
   (cenário 8 do PRD).
6. O resultado final (`registros` normalizados + metadados como nome do
   arquivo e data/hora de carregamento) é passado para
   `armazenamentoLocal.salvarCiclo`, que substitui integralmente qualquer
   ciclo salvo anteriormente.

## 5. Como a data atual é comparada com as datas do CSV

- `datas.parseDataBR(texto)` faz o parsing manual de `DD/MM/AA` (nunca usa
  `new Date(string)` diretamente sobre o texto, para não depender de
  interpretação ambígua do navegador):
  1. Divide o texto em três partes por `/`; se não houver exatamente três
     partes numéricas, marca como inválida.
  2. Valida faixas básicas (dia entre 1 e 31, mês entre 1 e 12).
  3. Converte o ano de 2 dígitos para 4 dígitos assumindo o século 2000
     (`AA` → `20AA`), já que o gerador do CSV sempre produz datas do ciclo
     atual/futuro próximo.
  4. Constrói a data local com dia/mês/ano e confirma que o resultado
     "bate" com os valores informados (isso descarta datas impossíveis
     como `31/02/26`, que o construtor de data rolaria para março).
  5. Retorna `{ valida: true, dataISO: 'AAAA-MM-DD' }` ou `{ valida: false }`.
- `datas.hojeLocal()` obtém a data atual do aparelho e zera a hora, usando
  sempre o fuso horário local do dispositivo (nunca UTC), evitando o risco
  de virada de dia incorreta perto da meia-noite.
- Para montar a tela principal:
  1. Filtra apenas os registros com `dataValida: true` e ordena por
     `dataISO`.
  2. Se não houver nenhum registro com data válida (todas as linhas com
     data quebrada), a tela principal trata isso como o mesmo tipo de erro
     de arquivo malformado usado nos cenários 4/5 — nenhuma leitura de
     "hoje" é possível sem pelo menos uma data válida no ciclo.
  3. Compara `hojeLocal()` com a primeira (`inicio`) e a última (`fim`) data
     válida do ciclo ordenado:
     - `hoje < inicio` → estado "ciclo ainda não começou";
       `CartaoCicloForaDoIntervalo` mostra a data de início (cenário 11).
     - `hoje > fim` → estado "ciclo já terminou";
       `CartaoCicloForaDoIntervalo` mostra a data de término e sugere
       carregar um novo ciclo (cenário 12).
     - Caso contrário, procura o registro cujo `dataISO` seja igual ao de
       hoje e o exibe em `CartaoTreino` como "Treino de Hoje" (cenários 9 e
       10).
  4. Para "amanhã", calcula `hojeLocal() + 1 dia` e procura o registro
     correspondente. Se existir, exibe em `CartaoTreino`; se não existir
     (fora do intervalo do ciclo, ex.: hoje é o último dia) exibe
     `CartaoCicloForaDoIntervalo` na variante "sem dado para amanhã"
     (cenário 13).

## 6. Armazenamento local (localStorage)

- Chave única, ex.: `treinoDoDia:ciclo:v1`.
- Valor: um único objeto JSON serializado contendo:
  - `versao` (inteiro, para permitir evolução futura do formato salvo);
  - `carregadoEm` (data/hora ISO de quando o CSV foi lido);
  - `nomeArquivoOriginal` (nome do arquivo selecionado, apenas informativo);
  - `registros` (array com todas as linhas normalizadas, na ordem em que
    apareceram no CSV, cada uma já incluindo os campos reservados `feito` e
    `notaSensacao` mencionados na seção 4).
- `armazenamentoLocal.carregarCiclo()` faz `JSON.parse` do valor salvo; se a
  chave não existir, ou o conteúdo salvo estiver corrompido/não for um JSON
  válido, é tratado exatamente como "nenhum ciclo carregado" — ou seja, os
  cenários "primeira abertura" e "memória local apagada" do PRD (1 e 2)
  compartilham o mesmo caminho de código.
- `armazenamentoLocal.salvarCiclo(...)` sempre sobrescreve a chave por
  inteiro — não existe merge parcial entre ciclos (cenário 3).

## 7. PWA e uso offline

- `vite-plugin-pwa` (ou equivalente) gera o `manifest.webmanifest` (nome,
  ícones em `public/icons/`, cor de tema, `display: standalone`) e registra
  um service worker que faz cache dos arquivos estáticos do app (HTML, JS,
  CSS, ícones) no momento da instalação.
- O service worker cuida apenas dos arquivos do próprio app (a "casca"); os
  dados do ciclo continuam vivendo exclusivamente no `localStorage`, que já
  é nativamente disponível offline no navegador.
- Resultado esperado: depois da primeira visita (que baixa e cacheia os
  arquivos do app) e do primeiro carregamento de um CSV, o app abre e
  funciona normalmente sem conexão (cenário 15).

## 8. Mapeamento dos cenários de erro do PRD para o tratamento técnico

| # | Cenário (PRD seção 8) | Tratamento técnico |
|---|---|---|
| 1 | Primeira abertura sem CSV | `armazenamentoLocal.carregarCiclo()` retorna vazio → `estadoApp = 'sem_ciclo'` → `TelaCarregarCiclo`. |
| 2 | Memória local apagada | Mesmo caminho do cenário 1 (chave ausente ou JSON inválido tratado como vazio). |
| 3 | Carregar novo ciclo | `BotaoCarregarCiclo` sempre montado; fluxo de carregamento chama `salvarCiclo`, que substitui a chave inteira. |
| 4 | Arquivo não é CSV / vazio | Validação de estrutura em `parseCsv.js` falha antes de qualquer gravação; `MensagemErro` exibido; ciclo anterior preservado. |
| 5 | CSV sem colunas obrigatórias | Mesma validação de estrutura, comparando o cabeçalho detectado (normalizado para minúsculas, sem espaços nas bordas) com a lista fixa de colunas exigidas. |
| 6 | Linha com data inválida | `datas.parseDataBR` marca `dataValida: false`; linha aparece em `ListaCicloCompleto` com indicador visual, mas é ignorada no cálculo de hoje/amanhã. |
| 7 | Linha com tempo não numérico | `modeloCiclo.normalizarLinha` converte para `0` quando `Number(...)` é `NaN`. |
| 8 | Semana incompleta | Nenhuma verificação de múltiplo de 7 é implementada; todas as linhas normalizadas são exibidas. |
| 9 | Hoje é dia de treino | Registro do dia encontrado por `dataISO` é passado a `CartaoTreino`, exibindo `tipo`/`treino`/`tempo`/`rpe`/`forca` como estão. |
| 10 | Hoje é OFF | Mesmo caminho do cenário 9; `CartaoTreino` aplica estilo diferenciado quando `tipo` começa com "OFF", sem esconder o texto de `treino`. |
| 11 | Data atual antes do início | `hoje < inicio` → `CartaoCicloForaDoIntervalo` (variante "ainda não começou"). |
| 12 | Data atual depois do fim | `hoje > fim` → `CartaoCicloForaDoIntervalo` (variante "já terminou"). |
| 13 | Amanhã fora do ciclo | Busca por `dataISO` de amanhã não encontra registro → `CartaoCicloForaDoIntervalo` (variante "sem dado para amanhã"). |
| 14 | Consulta ao ciclo completo | `ListaCicloCompleto` renderiza todos os registros normalizados, ordenados por `dataISO` (inválidos ficam no fim ou marcados, conforme ordenação estável). |
| 15 | Uso offline | Service worker cacheia os arquivos do app; dados continuam no `localStorage`, sem dependência de rede. |

## Plano de Execução

- [x] Task 1 — Criar o `.gitignore` incluindo `dados_do_ciclo.csv`, `node_modules/` e `dist/`, e garantir que ele seja a primeira coisa commitada, antes de qualquer outra ação Git (inclusive antes de criar o repositório remoto).
- [x] Task 2 — Inicializar o projeto base React + Vite (template mínimo) e verificar que roda localmente com `npm run dev`.
- [x] Task 3 — Configurar Tailwind (dependências, `tailwind.config.js`, `postcss.config.js`, diretivas em `src/styles/index.css`) e validar com um elemento de teste estilizado.
- [x] Task 4 — Configurar `vite.config.js` com o `base` apontando para o caminho do GitHub Pages e validar que `npm run build` gera a pasta `dist/` corretamente.
- [x] Task 5 — Criar `lib/datas.js` (`parseDataBR`, `hojeLocal`, comparação de datas) e testar manualmente casos válidos e inválidos, incluindo datas impossíveis como "35/13/26".
- [x] Task 6 — Instalar o PapaParse e criar `lib/parseCsv.js`: leitura do arquivo selecionado, parsing com autodetecção de delimitador, e validação das colunas obrigatórias.
- [x] Task 7 — Criar `lib/modeloCiclo.js`: normalização de cada linha (`fase,data,dia,tipo,treino,tempo,rpe,forca`), incluindo coerção de `tempo` não numérico para `0`, marcação de data inválida, e os campos reservados `feito`/`notaSensacao` para uso futuro.
- [x] Task 8 — Criar `lib/armazenamentoLocal.js`: salvar, carregar e substituir o ciclo no `localStorage`, tratando chave ausente ou JSON corrompido como "nenhum ciclo carregado".
- [x] Task 9 — Criar `TelaCarregarCiclo.jsx` com o seletor de arquivo, ligando o fluxo `parseCsv` → `modeloCiclo` → validação → `armazenamentoLocal`, e exibindo `MensagemErro` nos casos de arquivo inválido ou colunas faltando.
- [x] Task 10 — Criar `BotaoCarregarCiclo.jsx` reutilizável e integrá-lo como sempre visível na tela principal, reaproveitando o mesmo fluxo de carregamento/substituição do ciclo.
- [x] Task 11 — Criar `App.jsx` com a máquina de estados (`sem_ciclo` / `ciclo_carregado`), carregando do `localStorage` ao montar e alternando entre `TelaCarregarCiclo` e a tela principal.
- [x] Task 12 — Criar `CartaoTreino.jsx` e montar o cartão "Treino de Hoje", incluindo a lógica de localizar o registro do dia atual e o estilo diferenciado para dias OFF.
- [x] Task 13 — Montar o cartão "Treino de Amanhã" reaproveitando `CartaoTreino.jsx`, incluindo o caso de não haver dado para o dia seguinte.
- [x] Task 14 — Criar `CartaoCicloForaDoIntervalo.jsx` e integrar os estados "antes do início do ciclo" e "depois do fim do ciclo" na tela principal.
- [x] Task 15 — Criar `ListaCicloCompleto.jsx` e `ItemDiaCiclo.jsx`, exibindo todos os dias em ordem cronológica, com indicação visual para linhas de data inválida.
- [x] Task 16 — Configurar o PWA (`manifest.webmanifest`, ícones, plugin de service worker) e validar instalação na tela inicial e uso offline após carregar um ciclo.
- [x] Task 17 — Percorrer manualmente os 15 critérios de aceitação do PRD usando o `dados_do_ciclo.csv` de teste (e variações manuais para os cenários de erro), registrando qualquer desvio encontrado na seção "Desvios" abaixo.

## Desvios

- **`ItemDiaCiclo.jsx` — campo `treino` sem truncamento/expansão.** A
  seção 3 especifica que o campo `treino` na lista do ciclo completo deve
  ser "truncado/expansível se muito longo". A implementação atual exibe o
  texto completo sempre, sem truncamento nem controle de
  expandir/recolher. Motivo: nenhum critério de aceitação do PRD depende
  desse comportamento especificamente, e truncar/expandir exigiria decidir
  um limite de caracteres e um padrão de interação (clique para expandir?
  "ver mais"?) não detalhado no Spec; optei por não improvisar esses
  detalhes de UI sem definição explícita. O texto integral continua
  visível e legível, apenas ocupando mais espaço vertical em treinos com
  descrição longa.
