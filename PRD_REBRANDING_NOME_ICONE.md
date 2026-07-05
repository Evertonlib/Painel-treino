# PRD — Rebranding de Nome e Ícone (Treino do Dia → Sistema Ritmo Certo)

## Objetivo

O app "Treino do Dia" (pasta Painel-treino) é a referência visual da família de apps
"Sistema Ritmo Certo" — foi dele que saiu o `DESIGN_SYSTEM.md` usado pelos demais apps
da família. No entanto, ele ainda carrega o nome antigo ("Treino do Dia") e um ícone que
não representa a marca atual, enquanto o app irmão Despertar_BA26 já resolveu os dois
pontos. Esta melhoria atualiza exclusivamente **nome exibido** e **ícone** deste app, para
que ele fique alinhado ao resto da família. Nenhuma lógica, layout, dado ou fluxo do app
é alterado.

## Relação com os scripts existentes

O projeto usa Vite + React + Tailwind, com PWA gerado pelo plugin `vite-plugin-pwa`. Os
scripts do `package.json` (`dev`, `build`, `deploy`, `preview`, `lint`) não mudam de
comportamento: o manifest do PWA (`manifest.webmanifest`) continua sendo **gerado
automaticamente no build**, a partir do bloco `manifest` dentro de `vite.config.js` — não
existe hoje um arquivo `manifest.webmanifest` versionado manualmente no repositório. A
melhoria consiste em editar valores de configuração e textos estáticos já existentes, sem
adicionar novos scripts, dependências ou etapas de build.

### Como o Despertar_BA26 resolveu o mesmo problema (referência, somente leitura)

O Despertar_BA26 é um app estático simples (sem Vite/build), então ele versiona um
`manifest.webmanifest` manual na raiz e referencia `icon-192.png`/`icon-512.png` também
como favicon (`<link rel="icon" href="icon-192.png">`), reaproveitando os mesmos arquivos
de ícone para as duas finalidades — uma única fonte de verdade visual para o app.

O Painel-treino tem uma arquitetura diferente (build via Vite, manifest gerado, ícone do
PWA em `public/icons/` separado de um `favicon.svg` desenhado à mão). O princípio adotado
do Despertar_BA26 — nome definido em um único lugar de configuração e um único conjunto de
arquivos de ícone reaproveitado — é o que orienta as decisões abaixo, adaptado à
arquitetura já existente no Painel-treino (nada do fluxo de build é reestruturado).

## Arquivos afetados

| Arquivo | O que muda |
|---|---|
| `vite.config.js` | `manifest.name` e `manifest.short_name` (hoje `"Treino do Dia"`) passam a refletir o novo nome. `manifest.icons` e `includeAssets` continuam apontando para `icons/icon-192.png` e `icons/icon-512.png` (mesmos nomes de arquivo, conteúdo novo). |
| `index.html` | `<title>` (hoje `Treino do Dia`) passa a refletir o novo nome. A tag `<link rel="icon">` passa a apontar para o novo ícone PNG em vez do `favicon.svg` atual (ver seção "Premissas assumidas"). |
| `src/App.jsx` | Texto do `<h1>` no cabeçalho do app (hoje `Treino do Dia`, linha do header sticky). |
| `src/components/TelaCarregarCiclo.jsx` | Texto do `<h1>` na tela inicial de carregar CSV (hoje `Treino do Dia`). |
| `public/icons/icon-192.png` | Substituído pelo novo arquivo do ícone "Timeline de Passada" (192px), entregue separadamente. |
| `public/icons/icon-512.png` | Substituído pelo novo arquivo do ícone "Timeline de Passada" (512px), entregue separadamente. |
| `README.md` | Título (`# Treino do Dia`) e a única menção ao nome do app no texto corrido passam a refletir o novo nome, por consistência da documentação. Links para `PRD_APP_TREINO_DO_DIA.md`/`SPEC_APP_TREINO_DO_DIA.md` continuam apontando para os mesmos nomes de arquivo (esses arquivos não são renomeados). |

## O que será adicionado

- Os dois novos arquivos de ícone "Timeline de Passada" (192px e 512px), que substituirão
  o conteúdo atual de `public/icons/icon-192.png` e `public/icons/icon-512.png` (mesmo
  caminho e nome de arquivo — não são arquivos novos no sentido de exigir mudança de
  referência em `vite.config.js`).
- O novo texto "Sistema Ritmo Certo" nos pontos listados acima (título da aba, cabeçalho
  do app, tela inicial, manifest do PWA, título do README).

## O que será removido

- O arquivo `public/favicon.svg` (SVG desenhado à mão, hoje uma pista estilizada em fundo
  escuro) deixa de ser referenciado como favicon e pode ser removido do repositório, já que
  o favicon passa a reaproveitar o novo `icon-192.png` — mesmo padrão usado no
  Despertar_BA26 (um único arquivo de ícone para favicon e PWA).
- Nenhum texto de "Treino do Dia" é apagado sem substituição: todo lugar onde o nome
  aparece hoje recebe o nome novo no lugar, exceto os arquivos listados como não tocados.

## O que não será tocado

- **Lógica do app**: leitura/parse do CSV (`parseCsv.js`), cálculo de hoje/amanhã
  (`datas.js`), fases do ciclo (`modeloCiclo.js`, `FaseCiclo.jsx`), régua de zona
  (`estiloTreino.js`, `ReguaZona.jsx`) e demais componentes de exibição do treino
  (`CartaoTreino.jsx`, `ListaCicloCompleto.jsx`, `ItemDiaCiclo.jsx`,
  `CartaoCicloForaDoIntervalo.jsx`, `MensagemErro.jsx`, `BotaoCarregarCiclo.jsx`,
  `BotaoAlternarTema.jsx`).
- **`DESIGN_SYSTEM.md`**: continua sendo a fonte da verdade do design system; a única
  menção ao nome antigo ali é um exemplo ilustrativo de uso de fonte, não uma
  configuração do app, e não é alterada.
- **`style-guide.html`**: continua comitado como página de consulta visual local, não
  referenciado no `vite.config.js` e não entra no build (`dist/`). O texto de exemplo
  "Treino do Dia" que aparece ali (é uma prova visual estática, não conectada ao app real)
  não é alterado nesta melhoria.
- **`PRD_APP_TREINO_DO_DIA.md` e `SPEC_APP_TREINO_DO_DIA.md`**: são registros históricos do
  produto sob o nome antigo; não são renomeados nem editados.
- **Chaves de `localStorage`** `treinoDoDia:tema:v1` (`src/lib/tema.js`) e
  `treinoDoDia:ciclo:v1` (`src/lib/armazenamentoLocal.js`): são identificadores técnicos de
  persistência, não texto de marca. Alterá-las apagaria o tema e o ciclo já salvos de quem
  já usa o app instalado — permanecem exatamente como estão.
- **`"name": "treino-do-dia"` em `package.json`**: identificador interno do pacote npm, não
  visível ao usuário final; não é alterado.
- **Configuração de deploy**: `base: '/Painel-treino/'`, `start_url`, `scope` em
  `vite.config.js`, e o fluxo do `gh-pages` — nada disso muda; a URL de instalação e o
  processo de publicação continuam os mesmos.
- **Componente `IconePista`** (`src/components/icones.jsx`), usado como ícone decorativo ao
  lado do título no cabeçalho e na tela inicial: é um elemento de UI do design system, não
  o "ícone do app" (PWA/favicon) tratado nesta melhoria. Não é alterado (ver premissa
  abaixo, sujeita à confirmação do usuário).
- **Qualquer arquivo fora da pasta Painel-treino**, incluindo todo o projeto Despertar_BA26,
  usado aqui apenas como referência de leitura.

## Premissas assumidas

1. **Favicon reaproveita o ícone PWA em vez do SVG desenhado à mão.** Hoje
   `public/favicon.svg` é um arquivo separado dos ícones PWA. Assume-se que, seguindo o
   padrão do Despertar_BA26 (um único ícone reaproveitado para favicon e instalação), o
   favicon passa a apontar para `icon-192.png`, e `favicon.svg` é descontinuado — em vez de
   desenhar uma nova versão em SVG do ícone "Timeline de Passada". Se o usuário preferir
   manter um SVG vetorial dedicado ao favicon, essa premissa muda e um novo arquivo SVG
   precisaria ser desenhado/entregue à parte.
2. **O ícone decorativo `IconePista` no cabeçalho e na tela inicial não muda.** A melhoria
   descrita foca no "ícone do app" (o que aparece na instalação do PWA/aba do navegador),
   não no ícone decorativo ao lado do título dentro da interface. Assume-se que esse ícone
   de UI permanece como está. Se a intenção for que o corredor também substitua esse ícone
   inline, é preciso um novo componente SVG e isso passa a ser um item adicional de escopo.
3. **A descrição atual do ícone atual ("quadrado azul vazio") não corresponde exatamente ao
   que foi encontrado no repositório.** O `icon-192.png`/`icon-512.png` atuais mostram o
   mesmo desenho de "pista" (oval laranja/vermelho sobre fundo escuro) usado no
   `favicon.svg` e no ícone `IconePista` — não um quadrado azul vazio. Assume-se que o
   ícone a ser substituído é este (o desenho de pista atual), e não outro arquivo não
   encontrado na pesquisa.
4. **Os arquivos finais do novo ícone (192px e 512px) serão entregues prontos**, no formato
   e tamanho corretos para uso direto em `public/icons/`, sem necessidade de processamento
   adicional (recorte, geração de múltiplos tamanhos, etc.) no momento da implementação.
5. **`README.md` é atualizado por consistência**, mesmo não tendo sido citado
   explicitamente no pedido, porque é a porta de entrada de quem abre o repositório e cita
   o nome do app no título. Os links para os documentos históricos (PRD/SPEC antigos) não
   mudam de nome de arquivo.

## Riscos identificados

- **Cache do Service Worker/PWA.** Usuários que já instalaram o app no celular podem
  continuar vendo o nome e o ícone antigos até que o `vite-plugin-pwa` (modo
  `autoUpdate`) aplique a atualização e o sistema operacional atualize o ícone da tela
  inicial — esse comportamento é do próprio navegador/SO e não é controlável pelo código do
  app.
- **Ambiguidade sobre o favicon.** Se a premissa 1 (reaproveitar `icon-192.png` como
  favicon) não for a esperada pelo usuário, a implementação precisará ser refeita com um
  novo ícone SVG dedicado, que ainda não existe.
- **Ambiguidade sobre o ícone inline (`IconePista`).** Se a expectativa for que o corredor
  também apareça ao lado do título dentro do app (e não só no ícone de instalação), a
  melhoria ficará visualmente inconsistente entre o ícone de instalação (novo) e o ícone
  decorativo no cabeçalho (antigo, "pista").
- **Arquivos de ícone ainda não entregues.** Até a entrega dos arquivos finais de 192px e
  512px, a implementação desta melhoria fica bloqueada apenas na parte do ícone; a parte do
  nome pode ser implementada de forma independente.
- **Divergência de descrição do ícone atual.** Como o ícone hoje encontrado no repositório
  não é um "quadrado azul vazio" como descrito no pedido, existe o risco de estarmos
  planejando a substituição do arquivo errado, caso exista algum outro estado do ícone
  (por exemplo, um ícone de fallback do navegador) que não foi encontrado na pesquisa do
  código-fonte.

## Critérios de aceitação

1. **Título da aba do navegador.** Dado que o app é aberto em qualquer navegador, quando a
   página carrega, a aba do navegador deve exibir "Sistema Ritmo Certo" em vez de "Treino
   do Dia".

2. **Cabeçalho do app já carregado.** Dado que um ciclo de treino já foi carregado
   (localStorage populado), quando a tela principal é exibida, o texto ao lado do ícone no
   cabeçalho superior deve mostrar "Sistema Ritmo Certo" em vez de "Treino do Dia".

3. **Tela inicial sem ciclo carregado.** Dado que o app é aberto pela primeira vez (sem
   ciclo salvo no localStorage), quando a tela de "selecionar arquivo CSV" é exibida, o
   título grande da tela deve mostrar "Sistema Ritmo Certo" em vez de "Treino do Dia".

4. **Nome exibido ao instalar o PWA.** Dado que o app é buildado (`npm run build`) e aberto
   no navegador, quando o usuário aciona "instalar app" (ou "adicionar à tela inicial"), o
   nome sugerido pelo navegador para o atalho/app instalado deve ser "Sistema Ritmo Certo"
   (nome completo) ou "Ritmo Certo"/nome curto equivalente definido no manifest, e não
   "Treino do Dia".

5. **Ícone do app instalado.** Dado que o app é instalado como PWA após a substituição dos
   arquivos de ícone, quando o ícone aparece na tela inicial do celular, ele deve mostrar o
   desenho "Timeline de Passada" (corredor sobre barra de progressão), e não o desenho de
   pista/oval atual.

6. **Favicon na aba do navegador.** Dado que o app é aberto em um navegador desktop, quando
   a página carrega, o ícone exibido na aba deve corresponder ao novo ícone "Timeline de
   Passada" (via `icon-192.png`), e não ao `favicon.svg` de pista atual.

7. **Lógica do app permanece intacta.** Dado um arquivo CSV de ciclo válido, quando ele é
   carregado após a mudança de nome/ícone, o app deve continuar calculando e exibindo
   corretamente o treino de hoje, de amanhã, a fase do ciclo e a régua de zona — sem
   nenhuma diferença de comportamento em relação a antes da melhoria.

8. **Dados já salvos não são perdidos.** Dado um usuário que já tinha um ciclo carregado
   antes da atualização (dado salvo sob a chave `treinoDoDia:ciclo:v1`), quando ele abre o
   app após a atualização de nome/ícone, o ciclo salvo deve continuar aparecendo
   normalmente, sem pedir para recarregar o CSV.

9. **Preferência de tema já salva não é perdida.** Dado um usuário que já tinha escolhido
   tema claro ou escuro antes da atualização (chave `treinoDoDia:tema:v1`), quando ele abre
   o app após a atualização, o tema escolhido deve continuar sendo respeitado.

10. **Build de produção não quebra.** Dado o comando `npm run build`, quando ele é
    executado após as mudanças, o build deve concluir sem erros e gerar a pasta `dist/`
    normalmente, incluindo o `manifest.webmanifest` com o novo nome e os novos ícones.

11. **Deploy continua publicando no mesmo endereço.** Dado o comando `npm run deploy`,
    quando ele é executado após as mudanças, o app deve continuar publicado sob o mesmo
    caminho `/Painel-treino/` no GitHub Pages, sem mudança de URL.

12. **Cenário de erro — arquivo de ícone ausente ou corrompido.** Dado que um dos arquivos
    novos de ícone (192px ou 512px) não é entregue, está corrompido, ou não abre como
    imagem válida, quando o build é executado, ele deve ou falhar de forma visível (erro no
    `npm run build`) ou, se não falhar, o ícone exibido no app instalado deve ser
    perceptivelmente quebrado/em branco — em nenhum caso o app deve silenciosamente manter
    o ícone antigo sem que isso seja percebido como um problema pendente.

13. **Cenário de erro — nome não atualizado em algum ponto.** Dado que, por engano, algum
    dos quatro lugares de nome (título da aba, cabeçalho, tela inicial, manifest) não é
    atualizado, quando o app é revisado visualmente e via manifest gerado, essa
    inconsistência deve ser identificável comparando os quatro pontos listados nesta PRD —
    o critério de aceitação só é atendido quando os quatro estão consistentes entre si.

14. **Cenário de erro — `style-guide.html` ou `DESIGN_SYSTEM.md` alterados por engano.**
    Dado que a implementação toca em `style-guide.html` ou `DESIGN_SYSTEM.md`, quando o
    diff da mudança é revisado, isso deve ser tratado como um desvio do escopo desta
    melhoria e revertido, já que ambos os arquivos foram explicitamente definidos como "não
    tocar".
