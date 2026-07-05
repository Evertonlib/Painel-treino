# PRD — Rebranding de Nome e Ícone (Treino do Dia → Sistema Ritmo Certo)

## Objetivo

O app "Treino do Dia" (pasta Painel-treino) é a referência visual da família de apps
"Sistema Ritmo Certo" — foi dele que saiu o `DESIGN_SYSTEM.md` usado pelos demais apps
da família. No entanto, ele ainda carrega o nome antigo ("Treino do Dia") e um ícone que
não representa a marca atual, enquanto o app irmão Despertar_BA26 já resolveu os dois
pontos. Esta melhoria atualiza exclusivamente **nome exibido** e **ícone** deste app
(incluindo o ícone decorativo usado dentro da própria interface), para que ele fique
alinhado ao resto da família. Nenhuma lógica, layout, dado ou fluxo do app é alterado.

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

## Causa raiz do "quadrado azul" no atalho do celular (achado da pesquisa)

Ao buildar o projeto (`npm run build`) e inspecionar o `manifest.webmanifest` gerado,
confirmou-se que os caminhos dos ícones estão corretos e os arquivos são copiados
normalmente para `dist/icons/` — não é um problema de caminho quebrado ou 404. A causa é
outra: **nenhum ícone do manifest tem o campo `"purpose": "maskable"`**.

Sem um ícone declarado como maskable, no Android 13+ com o recurso "Ícones com tema"
(Material You / themed icons) ativado — que vem ligado por padrão em muitos aparelhos —,
o sistema ignora o desenho colorido do ícone e usa só a silhueta/alpha dele, repintando o
ícone inteiro com a cor de destaque do sistema (derivada do papel de parede, muitas vezes
azul por padrão). Como o desenho atual é um traçado fino sobre fundo quase preto, sem
margem de segurança (safe zone), o resultado da repintura vira, na prática, um quadrado
quase sólido de uma cor só — o "quadrado azul vazio" relatado, visível **só no atalho
instalado**, porque é o único lugar que passa por esse pipeline de ícone adaptável do
Android. Dentro do app (favicon, cabeçalho, ícone decorativo) o desenho aparece normal
porque esses usos não passam pela mascarização adaptável do Android.

Isso continua sendo parte do escopo da Mudança 2: o novo ícone precisa (a) ter uma versão
declarada no manifest com `purpose` incluindo `maskable`, e (b) essa versão precisa ter
margem de segurança suficiente (a arte principal ocupando a região central, seguindo a
zona segura recomendada para ícones adaptáveis do Android, deixando espaço ao redor para o
recorte do sistema), para que a repintura/recorte do Android não vire um bloco de cor sem
forma reconhecível.

## Verificação dos arquivos de ícone entregues

Na pasta `public/icons/` foram encontrados, além dos dois arquivos antigos (`icon-192.png`
e `icon-512.png`, com o desenho de pista atual), exatamente dois arquivos novos:

- `icone_cheio_512.png` — 512×512px, arte do corredor sobre a barra de progressão
  ocupando o quadro quase por inteiro (pouca margem), sobre fundo sólido escuro.
- `icone_seguro_512.png` — 512×512px, mesma arte, porém mais centralizada e com mais
  espaço ao redor (margem de segurança), também sobre fundo sólido escuro.

Os arquivos passaram por duas rodadas de ajuste durante a pesquisa, já concluídas:

1. **Cor de fundo**: a primeira entrega tinha fundo bege/off-white, destoando da paleta
   escura do app. Foi reenviada uma segunda versão com fundo escuro; a amostragem de pixel
   confirmou `RGB(20,25,28)`–`RGB(23,26,29)`, praticamente idêntico ao "Grafite" oficial do
   design system (`#14171b` = `RGB(20,23,27)`, `DESIGN_SYSTEM.md:21`) — a pequena variação
   é só ruído de compressão. Cor validada.
2. **Formato e resolução**: a segunda entrega veio com extensão `.jpg`, mas o conteúdo real
   era PNG, em 1024×1024px (o dobro do esperado). Os arquivos foram convertidos para PNG
   verdadeiro e redimensionados para 512×512px (reamostragem de alta qualidade), e as
   versões `.jpg` foram removidas. Os dois arquivos finais em `public/icons/` já estão
   corretos: `icone_cheio_512.png` e `icone_seguro_512.png`, PNG, 512×512px, fundo escuro
   consistente com o Grafite do design system.

Ambos os arquivos existem apenas em 512×512px — **não há uma versão em 192×192px** entre
os arquivos entregues. Como os dois arquivos novos têm exatamente o propósito esperado
(uma versão "cheia" e uma versão com margem de segurança), a leitura desta PRD segue com
base neles, usando `icone_cheio_512.png` com `purpose: "any"` e `icone_seguro_512.png` com
`purpose: "maskable"`. A ausência de uma variante 192×192px é tratada como premissa/risco
nas seções correspondentes abaixo, e não bloqueia o restante do planejamento.

## Arquivos afetados

| Arquivo | O que muda |
|---|---|
| `vite.config.js` | `manifest.name` passa a `"Sistema Ritmo Certo"` e `manifest.short_name` passa a `"Ritmo Certo"` (exatamente esse texto). `manifest.icons` passa a referenciar `icons/icone_cheio_512.png` (`purpose: "any"`, 512×512) e `icons/icone_seguro_512.png` (`purpose: "maskable"`, 512×512) no lugar de `icon-192.png`/`icon-512.png`. `includeAssets` passa a listar os dois novos nomes de arquivo. |
| `index.html` | `<title>` (hoje `Treino do Dia`) passa a `Sistema Ritmo Certo`. A tag `<link rel="icon">` passa a apontar para `icons/icone_cheio_512.png` em vez do `favicon.svg` atual. |
| `src/App.jsx` | Texto do `<h1>` no cabeçalho do app (hoje `Treino do Dia`) passa a `Sistema Ritmo Certo`. Import do ícone decorativo atualizado para o novo nome do componente (ver linha de `icones.jsx` abaixo). |
| `src/components/TelaCarregarCiclo.jsx` | Texto do `<h1>` na tela inicial de carregar CSV (hoje `Treino do Dia`) passa a `Sistema Ritmo Certo`. Import do ícone decorativo atualizado para o novo nome do componente. |
| `src/components/icones.jsx` | O componente hoje chamado `IconePista` (usado no cabeçalho e na tela inicial) é substituído por uma nova versão de ícone SVG desenhada em código, simplificada, representando "Timeline de Passada" (silhueta de corredor em passada sobre uma barra de progressão) — seguindo a mesma técnica dos demais ícones do arquivo (SVG inline, `viewBox 24x24`, traço único em `currentColor`, poucas formas). Como o desenho deixa de ser uma "pista", o componente é renomeado (proposta: `IconePassada`) para continuar descritivo, alinhado ao padrão de nomes dos outros ícones do arquivo (`IconeSol`, `IconeLua`, `IconeCalendario` etc.). Esse ícone **não** reaproveita os arquivos PNG (`icone_cheio_512.png`/`icone_seguro_512.png`); é um desenho novo, próprio, feito diretamente em SVG/JSX. |
| `public/icons/icone_cheio_512.png` e `public/icons/icone_seguro_512.png` | Passam a ser os arquivos de ícone oficiais do PWA/favicon, referenciados em `vite.config.js` e `index.html` (já entregues, nenhum conteúdo novo a gerar). |
| `public/icons/icon-192.png` e `public/icons/icon-512.png` | Deixam de ser referenciados (substituídos pelos dois arquivos acima) e são removidos do repositório. |
| `README.md` | Título (`# Treino do Dia`) e a única menção ao nome do app no texto corrido passam a refletir o novo nome, por consistência da documentação. Links para `PRD_APP_TREINO_DO_DIA.md`/`SPEC_APP_TREINO_DO_DIA.md` continuam apontando para os mesmos nomes de arquivo (esses arquivos não são renomeados). |

## O que será adicionado

- Os dois arquivos de ícone já entregues em `public/icons/` (`icone_cheio_512.png` e
  `icone_seguro_512.png`), referenciados no manifest com os propósitos `any` e `maskable`
  respectivamente.
- Uma nova versão SVG simplificada do ícone decorativo em `src/components/icones.jsx`,
  representando "Timeline de Passada" (corredor em passada + barra de progressão),
  desenhada com poucas formas, na mesma técnica dos ícones já existentes no arquivo.
- O novo texto "Sistema Ritmo Certo" (nome completo) e "Ritmo Certo" (nome curto, exato)
  nos pontos listados na tabela acima (título da aba, cabeçalho do app, tela inicial,
  manifest do PWA, título do README).

## O que será removido

- Os arquivos `public/icons/icon-192.png` e `public/icons/icon-512.png` (desenho de pista
  atual), substituídos pelos dois novos arquivos.
- O arquivo `public/favicon.svg` (SVG desenhado à mão, hoje uma pista estilizada em fundo
  escuro) deixa de ser referenciado como favicon e pode ser removido do repositório, já que
  o favicon passa a reaproveitar `icone_cheio_512.png` — mesmo padrão usado no
  Despertar_BA26 (um único arquivo de ícone para favicon e PWA).
- O desenho atual do componente `IconePista` (a pista/oval), substituído pelo novo desenho
  do corredor sobre a barra de progressão.
- Nenhum texto de "Treino do Dia" é apagado sem substituição: todo lugar onde o nome
  aparece hoje recebe o nome novo no lugar, exceto os arquivos listados como não tocados.

## O que não será tocado

- **Lógica do app**: leitura/parse do CSV (`parseCsv.js`), cálculo de hoje/amanhã
  (`datas.js`), fases do ciclo (`modeloCiclo.js`, `FaseCiclo.jsx`), régua de zona
  (`estiloTreino.js`, `ReguaZona.jsx`) e demais componentes de exibição do treino
  (`CartaoTreino.jsx`, `ListaCicloCompleto.jsx`, `ItemDiaCiclo.jsx`,
  `CartaoCicloForaDoIntervalo.jsx`, `MensagemErro.jsx`, `BotaoCarregarCiclo.jsx`,
  `BotaoAlternarTema.jsx`). Os demais ícones em `icones.jsx` (`IconeCronometro`,
  `IconeHalter`, `IconeSol`, `IconeLua`, `IconeAlerta`, `IconeBandeira`,
  `IconeCalendario`, `IconeCaixaVazia`, `IconeUpload`) também não são alterados — só o
  ícone hoje chamado `IconePista` entra em escopo.
- **`DESIGN_SYSTEM.md`**: continua sendo a fonte da verdade do design system; a única
  menção ao nome antigo ali é um exemplo ilustrativo de uso de fonte, não uma
  configuração do app, e não é alterada.
- **`style-guide.html`**: continua comitado como página de consulta visual local, não
  referenciado no `vite.config.js` e não entra no build (`dist/`). O texto de exemplo
  "Treino do Dia" e o ícone de exemplo que aparecem ali (é uma prova visual estática, não
  conectada ao app real) não são alterados nesta melhoria.
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
- **Qualquer arquivo fora da pasta Painel-treino**, incluindo todo o projeto Despertar_BA26,
  usado aqui apenas como referência de leitura.

## Premissas assumidas

1. **Favicon reaproveita o ícone PWA em vez do SVG desenhado à mão.** Hoje
   `public/favicon.svg` é um arquivo separado dos ícones PWA. Assume-se que, seguindo o
   padrão do Despertar_BA26 (um único ícone reaproveitado para favicon e instalação), o
   favicon passa a apontar para `icone_cheio_512.png` (a versão "cheia", sem a margem
   extra pensada para recorte adaptável), e `favicon.svg` é descontinuado.
2. **O ícone decorativo hoje chamado `IconePista` é redesenhado como uma nova versão SVG
   simplificada de "Timeline de Passada"**, feita diretamente em código (mesma técnica dos
   outros ícones do arquivo: traço único, `currentColor`, poucas formas), e não como um
   `<img>` apontando para os PNGs novos. Isso é uma reinterpretação simplificada do desenho
   das referências em PNG (que são coloridas, com gradiente e várias formas), não uma cópia
   fiel — a fidelidade exata ao visual das referências fica sujeita a ajuste após uma
   primeira versão ser desenhada.
3. **O componente é renomeado de `IconePista` para `IconePassada`.** Como o desenho deixa
   de representar uma pista, mantém-se o padrão de nomes descritivos do arquivo
   (`IconeSol`, `IconeLua` etc.). Isso implica atualizar os dois pontos de importação/uso
   (`src/App.jsx` e `src/components/TelaCarregarCiclo.jsx`). Se o usuário preferir manter o
   nome `IconePista` mesmo com o novo desenho (para minimizar o diff), essa renomeação pode
   ser descartada sem impacto no restante do escopo.
4. **O "quadrado azul vazio" descrito originalmente no pedido é o resultado do recurso
   "Ícones com tema" do Android sobre o ícone atual, não um arquivo diferente.** O
   `icon-192.png`/`icon-512.png` atuais mostram o mesmo desenho de "pista" usado no
   `favicon.svg` e no antigo `IconePista` (oval laranja/vermelho sobre fundo escuro). Sem
   `purpose: maskable` e sem margem de segurança, o Android recorta/repinta esse desenho no
   atalho instalado e o resultado visual vira um bloco de cor sólida — ver seção "Causa
   raiz do quadrado azul".
5. **Não haver uma variante 192×192px entre os arquivos entregues não é tratado como
   bloqueio.** O manifest passa a declarar apenas as duas entradas de 512×512px
   (`any` e `maskable`); um único ícone de 512px com propósito `maskable` já atende ao
   critério de instalabilidade do Chrome/Android, então não é necessário gerar ou pedir uma
   versão 192px adicional para esta melhoria.
6. **Os nomes de arquivo entregues (`icone_cheio_512.png`, `icone_seguro_512.png`) são
   mantidos como estão**, em vez de renomeados para um padrão em inglês consistente com os
   arquivos antigos (`icon-192.png`, `icon-512.png`). Prioriza-se simplicidade (menos
   arquivos mexidos); se o usuário preferir nomes renomeados por consistência, essa
   premissa muda e passa a incluir uma etapa de renomeação dos dois arquivos.
7. **`README.md` é atualizado por consistência**, mesmo não tendo sido citado
   explicitamente no pedido, porque é a porta de entrada de quem abre o repositório e cita
   o nome do app no título. Os links para os documentos históricos (PRD/SPEC antigos) não
   mudam de nome de arquivo.

## Riscos identificados

- **Cache do Service Worker/PWA.** Usuários que já instalaram o app no celular podem
  continuar vendo o nome e o ícone antigos até que o `vite-plugin-pwa` (modo
  `autoUpdate`) aplique a atualização e o sistema operacional atualize o ícone da tela
  inicial — esse comportamento é do próprio navegador/SO e não é controlável pelo código do
  app.
- **Fidelidade do novo ícone SVG inline em relação às referências PNG.** Como o ícone
  decorativo em `icones.jsx` é redesenhado à mão em código (não é uma cópia das imagens),
  o resultado é uma interpretação simplificada; pode não bater 100% com o visual das
  referências `icone_cheio_512.png`/`icone_seguro_512.png` e pode exigir uma rodada de
  ajuste visual após a primeira versão.
- **Arquivos de ícone 192px inexistentes.** Caso, mais adiante, seja necessário suporte
  específico a um ícone de 192px (por exemplo, algum launcher ou ferramenta que exija esse
  tamanho exato), ele precisará ser gerado a partir dos arquivos de 512px existentes — isso
  não está incluído no escopo atual.
- **Ícone novo repetir o mesmo problema do "quadrado azul", se a margem de segurança do
  arquivo `icone_seguro_512.png` não for suficiente.** Mesmo com `purpose: maskable`
  declarado corretamente, se a margem de segurança da arte não for suficiente para a zona
  de recorte do Android, o efeito de "bloco de cor sólida" nos "Ícones com tema" pode
  voltar a acontecer.
- **Comportamento de "Ícones com tema" varia por aparelho e versão do Android.** Mesmo com
  `purpose: maskable` e boa margem de segurança, alguns lançadores (launchers) Android
  aplicam a repintura de forma mais agressiva que outros; o resultado final pode não ficar
  idêntico em todos os aparelhos, e isso foge do controle do código do app.

## Critérios de aceitação

1. **Título da aba do navegador.** Dado que o app é aberto em qualquer navegador, quando a
   página carrega, a aba do navegador deve exibir "Sistema Ritmo Certo" em vez de "Treino
   do Dia".

2. **Cabeçalho do app já carregado.** Dado que um ciclo de treino já foi carregado
   (localStorage populado), quando a tela principal é exibida, o texto ao lado do ícone no
   cabeçalho superior deve mostrar "Sistema Ritmo Certo" em vez de "Treino do Dia", e o
   ícone ao lado do texto deve mostrar o novo desenho "Timeline de Passada", não mais a
   pista/oval antiga.

3. **Tela inicial sem ciclo carregado.** Dado que o app é aberto pela primeira vez (sem
   ciclo salvo no localStorage), quando a tela de "selecionar arquivo CSV" é exibida, o
   título grande da tela deve mostrar "Sistema Ritmo Certo" em vez de "Treino do Dia", e o
   ícone grande acima do título deve mostrar o novo desenho "Timeline de Passada".

4. **Nome exibido ao instalar o PWA.** Dado que o app é buildado (`npm run build`) e aberto
   no navegador, quando o usuário aciona "instalar app" (ou "adicionar à tela inicial"), o
   nome sugerido pelo navegador para o atalho/app instalado deve ser "Sistema Ritmo Certo"
   (nome completo) e o nome curto (short_name) usado em espaços reduzidos deve ser
   exatamente "Ritmo Certo" — e não "Treino do Dia".

5. **Ícone do app instalado.** Dado que o app é instalado como PWA após a substituição dos
   arquivos de ícone, quando o ícone aparece na tela inicial do celular, ele deve mostrar o
   desenho "Timeline de Passada" (corredor sobre barra de progressão) a partir de
   `icone_seguro_512.png`/`icone_cheio_512.png`, e não o desenho de pista/oval atual.

6. **Ícone do atalho não vira bloco de cor sólida em Android com "Ícones com tema".** Dado
   um aparelho Android 13+ com o recurso "Ícones com tema" ativado, quando o app é
   instalado na tela inicial após a troca do ícone e a adição de `purpose: maskable`
   (usando `icone_seguro_512.png`) no manifest, o atalho deve mostrar uma forma
   reconhecível do desenho "Timeline de Passada" (ainda que recolorido pelo sistema), e não
   um quadrado de cor sólida sem forma alguma — reproduzindo o problema relatado antes da
   melhoria.

7. **Favicon na aba do navegador.** Dado que o app é aberto em um navegador desktop, quando
   a página carrega, o ícone exibido na aba deve corresponder ao novo ícone "Timeline de
   Passada" (via `icone_cheio_512.png`), e não ao `favicon.svg` de pista atual.

8. **Lógica do app permanece intacta.** Dado um arquivo CSV de ciclo válido, quando ele é
   carregado após a mudança de nome/ícone, o app deve continuar calculando e exibindo
   corretamente o treino de hoje, de amanhã, a fase do ciclo e a régua de zona — sem
   nenhuma diferença de comportamento em relação a antes da melhoria.

9. **Dados já salvos não são perdidos.** Dado um usuário que já tinha um ciclo carregado
   antes da atualização (dado salvo sob a chave `treinoDoDia:ciclo:v1`), quando ele abre o
   app após a atualização de nome/ícone, o ciclo salvo deve continuar aparecendo
   normalmente, sem pedir para recarregar o CSV.

10. **Preferência de tema já salva não é perdida.** Dado um usuário que já tinha escolhido
    tema claro ou escuro antes da atualização (chave `treinoDoDia:tema:v1`), quando ele abre
    o app após a atualização, o tema escolhido deve continuar sendo respeitado.

11. **Build de produção não quebra.** Dado o comando `npm run build`, quando ele é
    executado após as mudanças, o build deve concluir sem erros e gerar a pasta `dist/`
    normalmente, incluindo o `manifest.webmanifest` com o novo nome, o novo nome curto e os
    novos ícones (com os dois `purpose` corretos).

12. **Deploy continua publicando no mesmo endereço.** Dado o comando `npm run deploy`,
    quando ele é executado após as mudanças, o app deve continuar publicado sob o mesmo
    caminho `/Painel-treino/` no GitHub Pages, sem mudança de URL.

13. **Cenário de erro — arquivo de ícone ausente ou corrompido.** Dado que um dos arquivos
    `icone_cheio_512.png` ou `icone_seguro_512.png` é removido, está corrompido, ou não
    abre como imagem válida, quando o build é executado, ele deve ou falhar de forma
    visível (erro no `npm run build`) ou, se não falhar, o ícone exibido no app instalado
    deve ser perceptivelmente quebrado/em branco — em nenhum caso o app deve
    silenciosamente manter o ícone antigo sem que isso seja percebido como um problema
    pendente.

14. **Cenário de erro — margem de segurança insuficiente no arquivo maskable.** Dado que
    `icone_seguro_512.png` não tem margem de segurança suficiente para a zona de recorte
    do Android, quando o app é instalado em um Android com "Ícones com tema" ativado, se o
    atalho voltar a parecer um bloco de cor sólida sem forma reconhecível, isso deve ser
    tratado como um problema do arquivo de imagem em si (não do manifest/código), a ser
    resolvido com uma nova versão do arquivo com mais margem, e não compensado via
    configuração.

15. **Cenário de erro — nome não atualizado em algum ponto.** Dado que, por engano, algum
    dos lugares de nome (título da aba, cabeçalho, tela inicial, `name` e `short_name` do
    manifest) não é atualizado, ou o `short_name` é gravado com um texto diferente de
    "Ritmo Certo", quando o app é revisado visualmente e via manifest gerado, essa
    inconsistência deve ser identificável comparando os pontos listados nesta PRD — o
    critério de aceitação só é atendido quando todos estão consistentes entre si.

16. **Cenário de erro — ícone decorativo não atualizado em um dos dois usos.** Dado que o
    componente do ícone decorativo é redesenhado, mas apenas um dos dois pontos de uso
    (cabeçalho em `App.jsx` ou tela inicial em `TelaCarregarCiclo.jsx`) é atualizado para
    importar o novo componente, quando as duas telas são comparadas lado a lado, a
    inconsistência (um mostrando o desenho novo, outro o antigo) deve ser tratada como
    defeito a corrigir antes de considerar a melhoria concluída.

17. **Cenário de erro — `style-guide.html` ou `DESIGN_SYSTEM.md` alterados por engano.**
    Dado que a implementação toca em `style-guide.html` ou `DESIGN_SYSTEM.md`, quando o
    diff da mudança é revisado, isso deve ser tratado como um desvio do escopo desta
    melhoria e revertido, já que ambos os arquivos foram explicitamente definidos como "não
    tocar".
