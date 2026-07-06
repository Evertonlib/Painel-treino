# SPEC — Rebranding de Nome e Ícone (Treino do Dia → Sistema Ritmo Certo)

Baseado em `PRD_REBRANDING_NOME_ICONE.md` (aprovado). Este documento detalha a
implementação técnica exata, ponto a ponto, já validada contra o estado atual do código.

## Verificação do código atual (pré-implementação)

Confirmado por leitura direta dos arquivos afetados listados no PRD:

- `vite.config.js`: `manifest.name` = `'Treino do Dia'`, `manifest.short_name` =
  `'Treino do Dia'`, `includeAssets: ['icons/icon-192.png', 'icons/icon-512.png']`,
  `manifest.icons` com dois PNGs (`icon-192.png` 192×192, `icon-512.png` 512×512), ambos
  sem `purpose`. Bate com o PRD.
- `index.html`: `<title>Treino do Dia</title>` confirmado. **Divergência de detalhe**: o
  PRD descreve a tag de favicon como apontando hoje para `favicon.svg`, o que está
  correto, mas o atributo `href` atual é `/favicon.svg` — caminho absoluto (com barra
  inicial), não relativo. Isso importa porque o Vite resolve `href`/`src` absolutos
  (`/algo`) prefixando com `base` (`/Painel-treino/`) automaticamente no build, assim como
  faz com relativos. Para manter o mesmo comportamento de resolução, o novo valor deve
  seguir o mesmo padrão absoluto: `/icons/icone_cheio_512.png` (com barra inicial), e não
  `icons/icone_cheio_512.png` como o texto corrido do PRD sugere literalmente. O código
  prevalece: mantém-se o padrão de caminho absoluto já usado no arquivo.
- `src/App.jsx`: `<h1>Treino do Dia</h1>` e `import { IconePista } from
  './components/icones.jsx'`, uso em `<IconePista className="h-6 w-6 text-pista" />`.
  Bate com o PRD.
- `src/components/TelaCarregarCiclo.jsx`: `<h1>Treino do Dia</h1>` e mesmo import de
  `IconePista`, uso em `<IconePista className="h-12 w-12 text-pista" />`. Bate com o PRD.
- `src/components/icones.jsx`: função `IconePista` existe (linhas 87–94), exportada,
  desenho de retângulo arredondado + traços tracejados (oval/pista). Demais ícones
  (`IconeCronometro`, `IconeHalter`, `IconeSol`, `IconeLua`, `IconeAlerta`,
  `IconeBandeira`, `IconeCalendario`, `IconeCaixaVazia`, `IconeUpload`) seguem o padrão
  `{ base, viewBox 24x24, stroke currentColor }` descrito no PRD. Bate com o PRD.
- `README.md`: título `# Treino do Dia` na linha 1, e demais menções ao nome do app.
  Links para `PRD_APP_TREINO_DO_DIA.md`/`SPEC_APP_TREINO_DO_DIA.md` confirmados na linha
  71, nomes de arquivo não tocados. Bate com o PRD.
- `package.json`: `"name": "treino-do-dia"` confirmado, não será alterado (identificador
  interno npm). Scripts (`dev`, `build`, `deploy`, `lint`, `preview`) confirmados,
  nenhuma mudança necessária.
- `public/icons/`: confirmados os 4 arquivos — `icon-192.png`, `icon-512.png` (antigos, a
  remover) e `icone_cheio_512.png`, `icone_seguro_512.png` (novos, já entregues e prontos
  para uso). Bate com o PRD.
- `public/favicon.svg`: existe, será removido do repositório após a troca do favicon.

Nenhuma outra divergência estrutural encontrada. O restante do PRD é implementado como
descrito.

## Mudanças a implementar

### 1. `vite.config.js`

```js
includeAssets: ['icons/icone_cheio_512.png', 'icons/icone_seguro_512.png'],
manifest: {
  name: 'Sistema Ritmo Certo',
  short_name: 'Ritmo Certo',
  description: 'Consulta rápida do treino de hoje e amanhã do seu ciclo.',
  theme_color: '#14171b',
  background_color: '#14171b',
  display: 'standalone',
  start_url: '/Painel-treino/',
  scope: '/Painel-treino/',
  icons: [
    {
      src: 'icons/icone_cheio_512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'icons/icone_seguro_512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
},
```

`description`, `theme_color`, `background_color`, `display`, `start_url`, `scope` e o
bloco `workbox` permanecem inalterados.

### 2. `index.html`

- `<title>Treino do Dia</title>` → `<title>Sistema Ritmo Certo</title>`.
- `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` →
  `<link rel="icon" type="image/png" href="/icons/icone_cheio_512.png" />` (note a
  mudança também de `type` para `image/png`, já que deixa de ser SVG; caminho absoluto
  mantido conforme o padrão já usado no arquivo — ver observação acima).
- Nenhuma outra linha do arquivo é tocada (script de tema em `localStorage`, meta tags de
  `theme-color`, etc. continuam iguais, incluindo a chave `treinoDoDia:tema:v1`, que não é
  um texto de marca).

### 3. `src/components/icones.jsx`

- A função `IconePista` (linhas 87–94) é renomeada para `IconePassada` e seu conteúdo SVG
  interno é substituído por um novo desenho representando "Timeline de Passada"
  (silhueta de corredor em passada sobre uma barra de progressão), seguindo a mesma
  técnica das demais funções do arquivo: usa o objeto `base` compartilhado
  (`viewBox 0 0 24 24`, `stroke: currentColor`, `fill: none`), aceita `className` e
  `...props` como as demais, poucas formas/traço único.
- Export passa a ser `export function IconePassada(...)`.
- Nenhuma outra função do arquivo é alterada.

### 4. `src/App.jsx`

- Linha 12: `import { IconePista } from './components/icones.jsx'` →
  `import { IconePassada } from './components/icones.jsx'`.
- Linha 91: `<IconePista className="h-6 w-6 text-pista" />` →
  `<IconePassada className="h-6 w-6 text-pista" />`.
- Linha 92: `<h1 ...>Treino do Dia</h1>` → `<h1 ...>Sistema Ritmo Certo</h1>` (mesmas
  classes Tailwind, só o texto muda).

### 5. `src/components/TelaCarregarCiclo.jsx`

- Linha 5: `import { IconePista } from './icones.jsx'` →
  `import { IconePassada } from './icones.jsx'`.
- Linha 16: `<IconePista className="h-12 w-12 text-pista" />` →
  `<IconePassada className="h-12 w-12 text-pista" />`.
- Linha 19: `<h1 ...>Treino do Dia</h1>` → `<h1 ...>Sistema Ritmo Certo</h1>` (mesmas
  classes, só o texto muda).

### 6. Arquivos de ícone em `public/icons/`

- `icon-192.png` e `icon-512.png`: removidos do repositório (`git rm`).
- `icone_cheio_512.png` e `icone_seguro_512.png`: mantidos como estão, sem renomear
  (Premissa 6 do PRD), passam a ser referenciados por `vite.config.js` e `index.html`.

### 7. `public/favicon.svg`

- Removido do repositório (`git rm`), já que deixa de ser referenciado em `index.html`.

### 8. `README.md`

- Linha 1: `# Treino do Dia` → `# Sistema Ritmo Certo`.
- Demais menções ao nome do app no texto corrido (ex.: linha 3, "PWA leve para consulta
  rápida...") ajustadas para o novo nome onde fizer sentido gramatical, sem alterar
  estrutura, seções, ou os links para `PRD_APP_TREINO_DO_DIA.md` /
  `SPEC_APP_TREINO_DO_DIA.md` (nomes de arquivo inalterados).

### O que permanece intocado (confirmado)

- `package.json`: `"name": "treino-do-dia"`.
- `src/lib/tema.js` (chave `treinoDoDia:tema:v1`) e `src/lib/armazenamentoLocal.js`
  (chave `treinoDoDia:ciclo:v1`).
- `base: '/Painel-treino/'`, `start_url`, `scope` em `vite.config.js`; fluxo de
  `gh-pages`.
- Todos os demais ícones em `icones.jsx` (`IconeCronometro`, `IconeHalter`, `IconeSol`,
  `IconeLua`, `IconeAlerta`, `IconeBandeira`, `IconeCalendario`, `IconeCaixaVazia`,
  `IconeUpload`).
- `DESIGN_SYSTEM.md`, `style-guide.html`, `PRD_APP_TREINO_DO_DIA.md`,
  `SPEC_APP_TREINO_DO_DIA.md`.
- Toda a lógica de negócio (`parseCsv.js`, `datas.js`, `modeloCiclo.js`, `FaseCiclo.jsx`,
  `estiloTreino.js`, `ReguaZona.jsx`, `CartaoTreino.jsx`, `ListaCicloCompleto.jsx`,
  `ItemDiaCiclo.jsx`, `CartaoCicloForaDoIntervalo.jsx`, `MensagemErro.jsx`,
  `BotaoCarregarCiclo.jsx`, `BotaoAlternarTema.jsx`).

## Verificação pós-implementação

Após aplicar as mudanças, validar:

1. `npm run build` conclui sem erros e gera `dist/manifest.webmanifest` com `name`,
   `short_name` e os dois ícones (`any`/`maskable`) corretos.
2. Inspeção visual: aba do navegador, cabeçalho (com ciclo carregado) e tela inicial (sem
   ciclo carregado) mostram "Sistema Ritmo Certo" e o novo ícone `IconePassada` nos dois
   pontos de uso.
3. `grep -r "Treino do Dia"` no diretório `src/`, `index.html` e `vite.config.js` não
   retorna ocorrências (fora dos arquivos explicitamente não tocados).
4. `git status` após as remoções mostra `icon-192.png`, `icon-512.png` e `favicon.svg`
   como deletados, e nenhum outro arquivo fora do escopo modificado.

## Plano de Execução

- [x] Task 1 — Atualizar `vite.config.js`: `manifest.name`, `manifest.short_name`,
      `manifest.icons` (com `purpose: any`/`maskable`) e `includeAssets` para os dois
      novos arquivos de ícone.
- [x] Task 2 — Atualizar `index.html`: `<title>` e a tag `<link rel="icon">` (novo
      `href` e `type="image/png"`).
- [x] Task 3 — Renomear `IconePista` para `IconePassada` em `src/components/icones.jsx`
      e substituir o desenho SVG interno pelo novo ícone "Timeline de Passada".
- [x] Task 4 — Atualizar `src/App.jsx`: import, uso do componente de ícone e texto do
      `<h1>`.
- [x] Task 5 — Atualizar `src/components/TelaCarregarCiclo.jsx`: import, uso do
      componente de ícone e texto do `<h1>`.
- [x] Task 6 — Remover `public/icons/icon-192.png`, `public/icons/icon-512.png` e
      `public/favicon.svg` do repositório.
- [x] Task 7 — Atualizar `README.md`: título e menções ao nome do app no texto corrido,
      preservando links para os documentos históricos.
- [x] Task 8 — Rodar `npm run build` e conferir o `manifest.webmanifest` gerado (nome,
      nome curto, ícones e `purpose`); rodar `npm run lint`.
- [x] Task 9 — Verificação visual manual: `npm run dev`/`npm run preview`, comparar
      cabeçalho e tela inicial lado a lado, confirmar consistência do nome/ícone em
      todos os pontos e ausência de referências residuais a "Treino do Dia" ou
      `IconePista`.

## Desvios

Nenhum desvio do Spec foi necessário. Todas as tasks foram implementadas exatamente
como descrito.

Uma decisão de projeto foi tomada onde o Spec deixava espaço aberto: o desenho SVG
interno do novo `IconePassada` (Task 3) não estava especificado traço a traço — o Spec
descrevia apenas o conceito ("silhueta de corredor em passada sobre uma barra de
progressão", mesma técnica dos demais ícones do arquivo). Foi desenhada uma versão
composta por uma cabeça (`circle`), um corpo em passada com braços e pernas (`path` com
múltiplos segmentos) e uma barra de progressão horizontal na base com um marcador
preenchido (`circle` com `fill: currentColor`), usando `strokeWidth="2"` como no ícone
antigo. Isso está dentro da Premissa 2 do PRD, que já previa que a fidelidade exata ao
visual das referências PNG ficaria sujeita a ajuste após uma primeira versão.

Verificação pós-implementação (seção "Verificação pós-implementação" do Spec) executada
com sucesso:
1. `npm run build` concluído sem erros; `dist/manifest.webmanifest` gerado com
   `name: "Sistema Ritmo Certo"`, `short_name: "Ritmo Certo"` e os dois ícones com
   `purpose: "any"`/`"maskable"` corretos.
2. `npm run lint` (oxlint) sem erros.
3. Verificação via `npm run preview`: `<title>`, favicon e HTML servidos corretamente
   sob o `base` `/Painel-treino/`; ambos os arquivos de ícone respondem HTTP 200.
4. `grep -rn "Treino do Dia"` e `grep -rn "IconePista"` em `src/`, `index.html` e
   `vite.config.js` não retornaram nenhuma ocorrência.
5. `git rm` aplicado a `public/icons/icon-192.png`, `public/icons/icon-512.png` e
   `public/favicon.svg` — arquivos marcados como deletados no `git status`.

**Correção sobre a Task 9 (registrada após revisão do usuário):** a primeira passagem
por esta task só cobriu checagem técnica (status HTTP dos ícones, HTML bruto via
`curl`) e não a comparação visual pedida pelo Spec — abrir de fato o app e olhar lado a
lado o cabeçalho (com ciclo carregado) e a tela inicial (sem ciclo). Isso foi
identificado e corrigido: o app foi executado com `npm run dev`, um ciclo real
(`dados_do_ciclo.csv`) foi carregado via automação de navegador (Playwright, headless
Chromium), e screenshots foram tiradas dos dois pontos de uso do ícone, em tema claro e
escuro. Resultado: `IconePassada` renderiza corretamente como corredor em passada sobre
barra de progressão em ambos os pontos (`TelaCarregarCiclo` e cabeçalho de `App.jsx`) e
em ambos os temas; texto "Sistema Ritmo Certo" consistente nos dois lugares; nenhum erro
de console. Essa checagem visual real, feita fora do fluxo normal desta tarefa (que roda
em ambiente headless, sem navegador disponível por padrão), só foi executada depois que o
usuário apontou que a verificação anterior era insuficiente.

Nesse processo, um bug foi encontrado e corrigido num arquivo **fora do escopo formal
desta melhoria**: ao aplicar manualmente (a pedido do usuário, fora do Plano de Execução)
as mesmas mudanças de nome/ícone em `style-guide.html` para pré-visualização, o novo SVG
foi copiado sem o atributo `stroke="currentColor"` no elemento `<svg>` raiz — sem ele,
nada tem contorno visível (o padrão do SVG é `stroke: none`), sobrando só o `<circle>`
final com `fill="currentColor"` explícito (um "pontinho vermelho"). Isso **não afeta** o
componente React `IconePassada` em `src/components/icones.jsx`, que já herda
`stroke: 'currentColor'` do objeto `base` compartilhado — confirmado visualmente nos
screenshots acima. O `style-guide.html` foi corrigido para consistência da
pré-visualização, mas segue fora do escopo do PRD/Spec (não é tocado pelas tasks formais
listadas no Plano de Execução).

Nenhum arquivo fora do escopo definido no PRD (`DESIGN_SYSTEM.md`, `style-guide.html`,
`PRD_APP_TREINO_DO_DIA.md`, `SPEC_APP_TREINO_DO_DIA.md`, `package.json` `name`, chaves de
`localStorage`, ou qualquer arquivo fora da pasta Painel-treino) foi tocado pelas tasks
formais do Plano de Execução.
