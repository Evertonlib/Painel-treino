# Design System — Sistema Ritmo Certo

Fonte da verdade da identidade visual usada pelos apps do "Sistema Ritmo
Certo" (Painel-treino e demais apps do ecossistema). Este documento é
neutro de tecnologia: os valores abaixo devem ser reproduzíveis tanto em
apps React/Tailwind quanto em HTML/CSS puro.

Extraído do código real de `Painel-treino` em: `tailwind.config.js`,
`src/styles/index.css`, `src/components/CartaoTreino.jsx`,
`src/components/ReguaZona.jsx`, `src/components/BotaoAlternarTema.jsx`,
`src/lib/tema.js`, `src/lib/estiloTreino.js` e `src/App.jsx` (header).

---

## 1. Cores

### 1.1 Paleta

| Nome | Hex | Uso |
|---|---|---|
| **Grafite** | `#14171b` | Cor base do tema escuro (fundo de página) e cor de texto no tema claro |
| Grafite soft | `#1c2025` | Fundo de cartões/superfícies elevadas no tema escuro |
| Grafite line | `#282d33` | Bordas/divisores no tema escuro |
| **Giz** | `#f3f1ea` | Cor base do tema claro (fundo de página) e cor de texto no tema escuro |
| Giz soft | `#fbfaf6` | Fundo de cartões/superfícies elevadas no tema claro |
| Giz line | `#e4e0d4` | Bordas/divisores no tema claro |
| **Pista** | `#d6482e` | Cor de marca/destaque: ícone principal, botão primário, badge ativo, anel de foco |
| Pista soft | `#f0d9d3` | Tom suave da marca, para fundos leves/realces sutis |
| Pista dark | `#b83a24` | Estado pressionado/ativo do botão primário (hover/active) |
| Zona 1 | `#4d7ea8` | Esforço leve / recuperação (azul) |
| Zona 2 | `#3f9e83` | Aeróbico leve (verde) |
| Zona 3 | `#d7a233` | Aeróbico moderado (dourado) — também usada como cor neutra padrão quando o tipo de treino não se encaixa em nenhuma zona |
| Zona 4 | `#dd7a2c` | Limiar (laranja) |
| Zona 5 | `#c73a2f` | Máxima intensidade (vermelho) — também usada para treinos de VO2máx |
| Força | `#7c5cbf` | Treino de força (roxo) |
| Off | `#767d87` | Dia de descanso (cinza neutro) |

Grafite e Giz são pares opostos (fundo/texto trocam de papel entre os
temas); Pista é a única cor que não muda entre temas. As cores de zona
representam um espectro fisiológico real (Z1 → Z5, esforço crescente) e
devem manter essa ordem de matiz (azul → verde → dourado → laranja →
vermelho) em qualquer app que as reutilize.

### 1.2 Variáveis CSS (para apps sem Tailwind)

```css
:root {
  /* Grafite (base escura) */
  --grafite: #14171b;
  --grafite-soft: #1c2025;
  --grafite-line: #282d33;

  /* Giz (base clara) */
  --giz: #f3f1ea;
  --giz-soft: #fbfaf6;
  --giz-line: #e4e0d4;

  /* Pista (marca) */
  --pista: #d6482e;
  --pista-soft: #f0d9d3;
  --pista-dark: #b83a24;

  /* Zonas de esforço */
  --zona-z1: #4d7ea8;
  --zona-z2: #3f9e83;
  --zona-z3: #d7a233;
  --zona-z4: #dd7a2c;
  --zona-z5: #c73a2f;
  --zona-forca: #7c5cbf;
  --zona-off: #767d87;
}
```

### 1.3 Tema claro/escuro

- O tema é uma classe (`dark`) aplicada na raiz do documento
  (`<html class="dark">`), não um atributo `data-theme` nem apenas
  `prefers-color-scheme`. Toda regra de cor do tema escuro é escrita como
  variante dessa classe (equivalente a `.dark &` em CSS puro).
- Persistência: `localStorage`, chave `treinoDoDia:tema:v1`, valores
  string `"claro"` ou `"escuro"` (não `"light"`/`"dark"`).
- Ordem de resolução ao carregar a página:
  1. Lê a chave no `localStorage`; se for um valor válido, usa-a.
  2. Se não houver valor salvo, usa `prefers-color-scheme: dark` do
     sistema operacional/navegador.
  3. Se nada disso resolver, o padrão é `"claro"`.
  4. Se `localStorage` não estiver disponível (falha silenciosa em
     `try/catch`), o app degrada para funcionar só na sessão atual, sem
     travar.
- Ao alternar o tema, a classe `dark` é adicionada/removida da raiz do
  documento e o novo valor é regravado no `localStorage`.
- Em CSS puro, o equivalente é: ler/gravar a preferência em
  `localStorage`, aplicar `document.documentElement.classList.toggle('dark', condicao)`
  e escrever os estilos escuros sob um seletor `.dark`.

Mapeamento de papéis por tema:

| Papel | Tema claro | Tema escuro |
|---|---|---|
| Fundo de página | Giz `#f3f1ea` | Grafite `#14171b` |
| Texto padrão | Grafite `#14171b` | Giz `#f3f1ea` |
| Fundo de cartão | Giz soft `#fbfaf6` | Grafite soft `#1c2025` |
| Borda/divisor | Grafite a 10% de opacidade | Giz a 10% de opacidade |
| Marca/destaque | Pista `#d6482e` (igual nos dois temas) | Pista `#d6482e` |

---

## 2. Tipografia

Três famílias, cada uma com um papel fixo — não são intercambiáveis:

| Família | Papel | Onde aparece |
|---|---|---|
| **Bebas Neue** (display) | Títulos grandes, condensada e maiúscula-friendly | Título do app no header ("Treino do Dia"), nome do tipo de treino dentro do cartão (ex.: "Z3 Endurance", "Descanso") |
| **Inter** (sans) | Texto corrido | Corpo de página, descrição do treino, texto geral da interface |
| **IBM Plex Mono** (mono) | Rótulos, badges, números e metadados | Badge "Hoje"/"Amanhã", data/dia/fase no topo do cartão, chips de tempo e RPE, rótulos das zonas (Z1..Z5), cabeçalhos de seção em caixa alta |

Regras de uso complementares:

- Textos em mono que funcionam como rótulo/badge usam caixa alta e um
  leve espaçamento entre letras (`letter-spacing: 0.02em` — token
  "wideish"), nunca peso normal minúsculo.
- Números (RPE, tempo em minutos, datas) devem usar variantes tabulares
  do algarismo (`font-variant-numeric: tabular-nums` / feature `tnum`,
  `lnum` ativadas globalmente no `<body>`) para não "dançar" quando o
  valor muda.

### 2.1 Carregamento

Self-hosted via `@fontsource` (pacotes npm), sem nenhuma CDN externa de
fontes (sem Google Fonts via `<link>`, sem `@import` de domínio externo).
Cada fonte é importada apenas no subset `latin` (cobre os acentos do
português — á, ã, ç, é, ô etc.) e apenas nos pesos realmente usados, para
manter o bundle/PWA leve:

```css
@import '@fontsource/bebas-neue/latin.css';          /* peso 400 (única disponível) */
@import '@fontsource/inter/latin-400.css';
@import '@fontsource/inter/latin-500.css';
@import '@fontsource/inter/latin-600.css';
@import '@fontsource/inter/latin-700.css';
@import '@fontsource/ibm-plex-mono/latin-400.css';
@import '@fontsource/ibm-plex-mono/latin-500.css';
```

Em um app HTML/CSS puro sem bundler, o equivalente é baixar os arquivos
de fonte (`.woff2`) desses mesmos pacotes/pesos e servi-los localmente
com `@font-face`, mantendo o mesmo subset `latin` e os mesmos pesos.

Pilha de fallback (caso a fonte não carregue): display → `sans-serif`;
sans → `sans-serif`; mono → `ui-monospace, monospace`.

---

## 3. Componentes-assinatura

### 3.1 Régua de Zona (elemento mais distintivo)

Não é decoração: é a mesma leitura que um atleta faria numa tabela de
zonas de FC/pace, mostrando onde o esforço do dia cai no espectro Z1→Z5.

**Anatomia:**

- Uma faixa horizontal com **5 segmentos** de largura igual
  (`flex: 1 1 0` cada), lado a lado, separados por um espaçamento
  pequeno de ~2px entre eles.
- Cada segmento é uma **cápsula** (`border-radius` total, cantos
  totalmente arredondados — "pill"), não um retângulo.
- Altura do conjunto: **10px** na versão normal, **6px** na versão
  compacta.
- Cor de cada segmento, na ordem Z1→Z5: `#4d7ea8` (azul), `#3f9e83`
  (verde), `#d7a233` (dourado), `#dd7a2c` (laranja), `#c73a2f`
  (vermelho) — sempre nessa ordem, da esquerda para a direita.
- **Estado ativo vs. atenuado**: os segmentos que representam a
  zona/faixa do treino do dia ficam a **opacidade 100%**; todos os
  demais segmentos ficam a **opacidade 22%** (não somem, apenas
  esmaecem — o espectro completo continua visível como referência).
  A transição de opacidade é animada suavemente.
- Duas formas de ativação:
  - **Ponto único**: apenas 1 dos 5 segmentos fica ativo (treino cravado
    numa zona específica, ex. "Z4").
  - **Faixa**: um intervalo contíguo de segmentos fica ativo (ex. um
    treino "Endurance" ativa Z2, Z3 e Z4 ao mesmo tempo).
- Abaixo da faixa (apenas na versão não-compacta): os rótulos **Z1 Z2
  Z3 Z4 Z5**, um sob cada segmento, em fonte mono, ~10px, maiúsculas,
  cor de texto padrão a 40% de opacidade. A versão compacta omite esses
  rótulos e usa só a faixa colorida, menor.

Reconstrução em CSS puro (esqueleto):

```html
<div class="regua-zona">
  <div class="regua-zona__trilho">
    <span class="regua-zona__seg" style="background:#4d7ea8"></span>
    <span class="regua-zona__seg regua-zona__seg--ativo" style="background:#3f9e83"></span>
    <span class="regua-zona__seg" style="background:#d7a233"></span>
    <span class="regua-zona__seg" style="background:#dd7a2c"></span>
    <span class="regua-zona__seg" style="background:#c73a2f"></span>
  </div>
  <div class="regua-zona__rotulos">
    <span>Z1</span><span>Z2</span><span>Z3</span><span>Z4</span><span>Z5</span>
  </div>
</div>
```

```css
.regua-zona__trilho { display: flex; gap: 2px; height: 10px; }
.regua-zona__seg {
  flex: 1 1 0;
  border-radius: 9999px;
  opacity: 0.22;
  transition: opacity 150ms;
}
.regua-zona__seg--ativo { opacity: 1; }
.regua-zona__rotulos {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-family: var(--fonte-mono);
  font-size: 10px;
  letter-spacing: 0.02em;
  opacity: 0.4;
}
```

### 3.2 Cartão de Treino

**Anatomia (de fora para dentro):**

- Container: cantos arredondados grandes (`border-radius` ~12px), borda
  de 1px na cor de texto padrão a 10% de opacidade, fundo = cor de
  "cartão" do tema (Giz soft / Grafite soft), `overflow: hidden`,
  posicionamento relativo.
- **Barra de cor lateral**: uma faixa vertical fina (4px de largura) na
  borda esquerda, ocupando 100% da altura do cartão, colorida com a cor
  do tipo de treino daquele dia (uma das cores de zona, força ou off).
  É o indicador de identidade do cartão à distância.
- Preenchimento interno: ~16px em todos os lados, exceto a esquerda que
  tem ~20px (para não colar no texto da barra colorida).
- **Linha superior** (`display: flex; justify-content: space-between`):
  - Badge à esquerda com o rótulo do cartão ("Hoje" / "Amanhã"): fonte
    mono, ~11px, semi-negrito, maiúsculo, `letter-spacing` levemente
    aberto, cantos arredondados médios.
    - Estado **destacado** (ex. "Hoje"): fundo sólido Pista, texto Giz.
    - Estado **normal** (ex. "Amanhã"): sem preenchimento, borda de 1px
      em Pista a 40% de opacidade, texto na cor Pista.
  - Metadado à direita: dia da semana · data · fase do ciclo, em mono,
    ~11px, cor de texto a 50% de opacidade, trunca com reticências se
    não couber.
- **Título do treino**: fonte display (Bebas Neue), ~28px, sem
  interlinha extra (`line-height: 1`), levemente espaçado, colorido com
  a mesma cor da barra lateral (ou cor de texto padrão quando o dia é de
  descanso, mostrando o texto "Descanso"). Quando o treino inclui força,
  um ícone de haltere (mesma cor do título) aparece à esquerda do texto.
- **Régua de Zona** (ver 3.1): aparece logo abaixo do título, só quando o
  tipo de treino tem uma posição de zona definida (não aparece em dias
  de força pura ou de descanso).
- **Descrição do treino**: parágrafo em fonte sans, ~14px, entrelinha
  confortável (~1.6), cor de texto a 80% de opacidade.
- **Chips inferiores** (`display: flex; flex-wrap: wrap; gap: 8px`):
  pequenas cápsulas com fundo neutro sutil (cor de texto a 5% de
  opacidade), anel de 1px a 10% de opacidade, fonte mono ~12px,
  peso médio, texto a 70% de opacidade. Ex.: "⏱ 45 min", "RPE 6".
- **Nota de força** (opcional, só quando o dia tem trabalho de força
  combinado): caixa com cantos arredondados, borda e fundo na cor Força
  a opacidades baixas (25% borda / 5% fundo), rótulo "FORÇA ·" em mono
  maiúsculo na cor Força, seguido do texto da nota em sans.

### 3.3 Botão primário

- Fundo sólido Pista, texto Giz.
- Cantos arredondados médios (~8px).
- Padding compacto (~12px horizontal, ~8px vertical).
- Rótulo em fonte mono, tamanho pequeno (~12px), maiúsculo, semi-negrito,
  `letter-spacing` levemente aberto (token "wideish").
- Estado pressionado/ativo: fundo muda para Pista dark (`#b83a24`).
- Foco visível: anel de 2px na cor Pista com um pequeno afastamento
  (`offset`) da borda do botão; no tema escuro, a cor do "buraco" entre
  o botão e o anel deve casar com o fundo Grafite (para o anel não
  parecer colado no botão).

### 3.4 Botão de alternar tema

- Botão quadrado pequeno, ~36×36px, cantos arredondados (~8px).
- Sem preenchimento; apenas borda de 1px na cor de texto padrão a 15%
  de opacidade.
- Ícone central (sol ou lua) na cor de texto padrão a 70% de opacidade —
  ícones de traço (`stroke`, não preenchidos), espessura de traço
  uniforme, pontas e junções arredondadas.
- Mostra o ícone de **sol** quando o tema atual é escuro (ação: voltar
  ao claro) e o ícone de **lua** quando o tema atual é claro (ação: ir
  para o escuro) — o ícone sempre representa o destino do clique, não o
  estado atual.
- Mesmo tratamento de foco visível do botão primário (anel Pista).

### 3.5 Cabeçalho (header)

- Fixado no topo da viewport (`position: sticky; top: 0`), acima do
  conteúdo rolável.
- Fundo semitransparente (~90% de opacidade) na cor de fundo do tema
  + desfoque do conteúdo atrás (`backdrop-filter: blur(...)`), com uma
  borda inferior de 1px na cor de texto padrão a 10% de opacidade.
- Conteúdo interno centralizado, largura máxima contida (~576px, mesma
  largura máxima usada pelo conteúdo principal da página), com padding
  horizontal ~16px e vertical ~12px.
- Layout interno: `flex; justify-content: space-between`.
  - Esquerda: ícone de marca (símbolo da pista, cor Pista, ~24px) +
    título do app em fonte display, ~20px, levemente espaçado.
  - Direita: botão de alternar tema + botão primário de ação
    ("Atualizar"), lado a lado com pequeno espaçamento entre eles.

### 3.6 Iconografia

Todos os ícones da interface seguem o mesmo estilo: SVG de traço (não
preenchido), `viewBox` 24×24, espessura de traço ~1.75, pontas e
junções de linha arredondadas (`stroke-linecap: round`,
`stroke-linejoin: round`), cor herdada do texto ao redor
(`stroke: currentColor`) — nunca uma cor fixa própria do ícone.

---

## 4. Acessibilidade

- **Foco visível global**: qualquer elemento focável via teclado recebe
  um contorno de 2px na cor Pista (`#d6482e`) com 2px de afastamento da
  borda do próprio elemento. Isso vale mesmo fora de botões/campos com
  estilo de foco próprio — é a regra padrão do documento inteiro.

  ```css
  :focus-visible {
    outline: 2px solid var(--pista);
    outline-offset: 2px;
  }
  ```

- **`prefers-reduced-motion`**: quando o usuário pede movimento
  reduzido no sistema operacional, todas as animações e transições da
  interface (opacidade da Régua de Zona incluída) são efetivamente
  cortadas para praticamente instantâneas, e a rolagem suave é
  desativada:

  ```css
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

- Contraste de texto segue a lógica de opacidade sobre a cor base do
  tema (não cores de cinza arbitrárias): texto secundário a 70-80% de
  opacidade, texto terciário/metadado a 40-50% de opacidade, sempre
  sobre Grafite ou Giz — o que preserva contraste suficiente em ambos os
  temas porque a opacidade é calculada sobre a mesma cor de texto do
  tema ativo, não uma cor cinza fixa que poderia falhar num dos dois
  fundos.
