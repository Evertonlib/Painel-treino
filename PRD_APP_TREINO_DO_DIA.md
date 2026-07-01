# PRD — App Treino do Dia

## 1. Objetivo

Criar um app mobile-first, instalável como PWA, que a usuária abre no
celular para ver rapidamente **o treino de hoje e o de amanhã**, sem precisar
abrir a planilha Excel ou o script Python. O app não calcula nada: ele
apenas lê um arquivo CSV que a própria usuária seleciona no celular e exibe
os campos como estão.

## 2. Relação com o fluxo atual

Hoje existe um script Python (fora deste projeto) que gera, a cada ciclo de
treino, dois artefatos a partir dos mesmos dados: uma planilha Excel
completa (com cálculos de carga, monotonia e tensão) e um arquivo CSV
simples com as colunas `fase,data,dia,tipo,treino,tempo,rpe,forca`.

Este app novo é um terceiro consumidor desse mesmo CSV, mas com um papel
diferente: onde a planilha Excel serve para planejamento e análise, o app
serve para consulta rápida no celular, no dia a dia, sem depender de abrir
o Excel. O app:

- **Nunca envia o CSV para o repositório ou para qualquer servidor.** O
  arquivo é lido inteiramente no navegador da usuária e fica salvo apenas no
  `localStorage` daquele navegador/celular.
- **Nunca replica os cálculos de carga, monotonia ou tensão.** Esses valores
  existem só no Excel. O app é só um facilitador de leitura dos campos
  brutos do CSV.
- É publicado como site estático no GitHub Pages. O código-fonte do app é
  público, mas os dados de treino da usuária não fazem parte do repositório
  em nenhum momento.

## 3. Estrutura de pastas e arquivos a ser criada

```
Painel-treino/
├── PRD_APP_TREINO_DO_DIA.md      (este arquivo)
├── dados_do_ciclo.csv             (exemplo real, já existente — não editar)
├── index.html
├── package.json
├── vite.config.js                 (base configurada para GitHub Pages)
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── manifest.webmanifest       (PWA: nome, ícones, cor de tema)
│   └── icons/                     (ícones do app em vários tamanhos)
├── src/
│   ├── main.jsx
│   ├── App.jsx                     (roteamento simples entre telas)
│   ├── components/
│   │   ├── SeletorArquivoCSV.jsx   (tela/estado de "sem dados carregados")
│   │   ├── BotaoCarregarCiclo.jsx  (botão sempre visível, abre seletor de arquivo)
│   │   ├── CartaoTreino.jsx        (cartão grande: um dia de treino)
│   │   ├── ListaCicloCompleto.jsx  (lista rolável, somente leitura)
│   │   └── DiaTreino.jsx           (item de linha reutilizado na lista)
│   ├── lib/
│   │   ├── parseCsv.js             (parsing + validação tolerante do CSV)
│   │   ├── armazenamentoLocal.js   (salvar/ler/limpar ciclo no localStorage)
│   │   └── datas.js                (comparar data do CSV com data atual do celular)
│   └── styles/
│       └── index.css               (Tailwind)
└── sw.js ou uso de plugin PWA      (service worker para funcionamento offline)
```

Observação: nomes de arquivo acima são uma proposta de organização, não uma
exigência rígida — podem ser ajustados na implementação sem precisar de novo
PRD, desde que a separação de responsabilidades (seleção de arquivo, parsing,
armazenamento, exibição) seja mantida.

## 4. O que será adicionado

- Projeto React + Vite + Tailwind novo, do zero.
- Tela inicial de "carregar ciclo" (aparece quando não há dados salvos).
- Botão "Carregar/atualizar ciclo", sempre visível em qualquer tela do app,
  que abre o seletor de arquivo do celular a qualquer momento.
- Leitura do CSV inteiramente no navegador (sem upload a servidor).
- Parsing tolerante do CSV (biblioteca de parsing no navegador).
- Armazenamento do ciclo interpretado em `localStorage`, substituindo
  qualquer ciclo carregado anteriormente.
- Tela principal com dois cartões grandes e fáceis de tocar: "Treino de
  Hoje" e "Treino de Amanhã", calculados comparando a data do celular com a
  coluna `data` de cada linha do CSV.
- Tela/seção secundária com o ciclo completo em lista rolável, somente
  leitura, sem nenhum cálculo — mostra os campos do CSV como estão.
- Configuração de PWA (manifest + service worker) para instalação na tela
  inicial e uso 100% offline após o primeiro carregamento do CSV.
- Estrutura de dados pensada para, no futuro, guardar também um estado por
  dia (ex.: "feito" e "anotação de sensação/RPE"), mesmo que essa
  funcionalidade não seja implementada nesta versão.

## 5. O que NÃO será tocado / NÃO será feito

- O script Python gerador de CSV/Excel não é tocado, alterado ou
  referenciado dentro deste projeto.
- A exigência do gerador de que o total de linhas seja múltiplo de 7 **não
  se aplica ao app**. O app deve funcionar normalmente com uma semana
  incompleta (menos de 7 dias) na última fase do ciclo.
- O app não calcula carga, monotonia, tensão nem qualquer outra métrica
  derivada — esses valores só existem no Excel.
- O app não envia, sincroniza ou faz backup do CSV em nenhum servidor,
  Google Sheets, banco de dados ou API externa.
- Esta versão (v1) não implementa marcar treino como feito nem anotar
  sensação/RPE — apenas prepara a estrutura para isso no futuro.
- O formato do CSV não é tratado como informação sensível: as colunas e
  regras de leitura ficam visíveis no código público do app.
- O arquivo `dados_do_ciclo.csv` presente na pasta do projeto é apenas para
  leitura/teste durante o desenvolvimento. O `.gitignore` incluindo esse
  arquivo deve ser criado e commitado antes de qualquer outro commit ou da
  criação do repositório remoto — o CSV real nunca pode entrar no histórico
  do Git em nenhum momento, nem mesmo em um commit posteriormente revertido.

## 6. Premissas assumidas

- A usuária sempre carrega o CSV manualmente pela primeira vez; o app não
  tem como saber que existe um ciclo novo sem essa ação.
- O celular da usuária tem a data/hora do sistema configurada corretamente;
  o app usa a data do próprio aparelho como referência para "hoje".
- Cada carregamento de CSV é sempre o ciclo completo e atual — não existe
  mesclagem entre ciclos; o novo sempre substitui o anterior por inteiro.
- O CSV é sempre gerado pelo mesmo script Python, então a grafia e ordem
  das colunas (`fase,data,dia,tipo,treino,tempo,rpe,forca`) são estáveis;
  o app não precisa suportar variações de nome de coluna.
- O separador do CSV pode ser vírgula ou ponto-e-vírgula, e o app deve
  detectar automaticamente qual foi usado.
- Um único navegador/celular é considerado por vez; não há sincronização
  entre dispositivos.
- O app funciona em navegadores móveis modernos (Chrome/Safari recentes)
  compatíveis com PWA e `localStorage`.

## 7. Riscos

- **Perda de dados local**: a memória do navegador (`localStorage`) pode ser
  apagada pela própria usuária (ex.: "limpar dados do navegador"), pelo
  sistema operacional em caso de pouco espaço, ou ao trocar de celular. Isso
  faz o app voltar à tela de "carregar ciclo" e a usuária precisa
  selecionar o CSV novamente. Mitigação: o botão de carregar ciclo é
  sempre acessível e o fluxo de carregar é rápido.
- **CSV desatualizado ou trocado por engano**: como o novo carregamento
  sempre substitui o anterior, selecionar o arquivo errado apaga o ciclo
  certo sem aviso de "tem certeza". Mitigação a considerar na
  implementação: mostrar um resumo (fase, datas de início/fim) antes ou
  logo depois de confirmar a substituição.
- **Formato de data ambíguo**: `DD/MM/AA` pode ser mal interpretado se o
  parsing usar convenções erradas (ex.: MM/DD). Precisa de parsing manual
  explícito, não `new Date(string)` do JavaScript.
- **Fuso horário / meia-noite**: comparar "data de hoje" perto da meia-noite
  pode gerar resultado inconsistente dependendo de como a data é obtida
  (UTC vs. horário local do aparelho). O app deve usar sempre a data local
  do celular.
- **PWA não instalável em todos os navegadores**: alguns navegadores
  (especialmente iOS Safari) têm suporte parcial a PWA; a instalação "salvar
  na tela inicial" pode exigir passos manuais da usuária.
- **Armazenamento sem limite de tamanho**: `localStorage` tem limite (em
  geral alguns MB); ciclos muito longos ou com texto muito extenso na coluna
  `treino` podem, em teoria, se aproximar desse limite. Risco considerado
  baixo dado o tamanho típico de um ciclo de treino.

## 8. Critérios de aceitação

Cada cenário abaixo descreve uma entrada e o resultado esperado.

1. **Primeira abertura, sem nenhum CSV carregado**
   Entrada: a usuária abre o app pela primeira vez, sem nunca ter carregado
   um arquivo.
   Resultado esperado: o app exibe a tela de seleção de arquivo, explicando
   que é preciso carregar o CSV do ciclo. Nenhum cartão de treino é exibido.

2. **Memória local apagada**
   Entrada: a usuária já tinha um ciclo carregado, mas o `localStorage` foi
   limpo (pela usuária, pelo sistema, ou por troca de aparelho).
   Resultado esperado: o app se comporta como na primeira abertura, pedindo
   para carregar o CSV novamente, sem erro ou tela em branco.

3. **Carregar um novo ciclo (botão sempre visível)**
   Entrada: a usuária já tem um ciclo carregado e toca no botão
   "Carregar/atualizar ciclo".
   Resultado esperado: o seletor de arquivo do celular abre normalmente; ao
   escolher um novo CSV válido, os dados antigos são completamente
   substituídos pelos novos, e a tela principal passa a refletir o novo
   ciclo.

4. **Arquivo selecionado não é um CSV ou está vazio**
   Entrada: a usuária seleciona um arquivo que não é CSV (ex.: uma imagem)
   ou um CSV vazio.
   Resultado esperado: o app exibe uma mensagem de erro compreensível
   (ex.: "não foi possível ler este arquivo como um ciclo de treino") e
   mantém a tela de seleção de arquivo, sem travar e sem apagar um ciclo
   válido carregado anteriormente.

5. **CSV sem as colunas obrigatórias**
   Entrada: a usuária seleciona um CSV que não tem todas as colunas
   `fase,data,dia,tipo,treino,tempo,rpe,forca` (por exemplo, faltando
   `rpe`).
   Resultado esperado: o app exibe uma mensagem de erro indicando que o
   arquivo não tem o formato esperado, e não substitui um ciclo válido já
   carregado.

6. **Linha com data em formato inválido**
   Entrada: o CSV é aceito, mas uma das linhas tem uma data que não segue
   `DD/MM/AA` (ex.: texto solto, campo vazio, ou data impossível como
   "35/13/26").
   Resultado esperado: essa linha específica é tratada como inválida e não
   aparece nos cartões de "hoje"/"amanhã" nem trava o app; o restante do
   ciclo com datas válidas é exibido normalmente. (A forma exata de sinalizar
   a linha problemática — omitir silenciosamente ou marcar visualmente na
   lista completa — fica a critério da implementação, desde que o app nunca
   quebre.)

7. **Linha com tempo não numérico**
   Entrada: uma linha do CSV tem um valor não numérico na coluna `tempo`
   (ex.: texto ou vazio).
   Resultado esperado: o app trata esse valor como `0` e continua exibindo a
   linha normalmente nos demais campos, sem erro.

8. **Ciclo com semana incompleta (menos de 7 dias na última semana)**
   Entrada: o CSV tem um total de linhas que não é múltiplo de 7 (ex.: a
   última semana tem só 3 dias).
   Resultado esperado: o app carrega o ciclo normalmente e exibe todos os
   dias existentes, inclusive os da semana incompleta, sem exigir ou avisar
   sobre múltiplo de 7 — essa regra é exclusiva do script gerador, não do
   app.

9. **Hoje é dia de treino**
   Entrada: a data do celular corresponde a uma linha do CSV cujo `tipo`
   não é OFF (ex.: "Z4 LT2").
   Resultado esperado: o cartão "Treino de Hoje" exibe os campos dessa linha
   (tipo, treino, tempo, rpe, força) como estão no CSV, sem nenhum cálculo
   adicional.

10. **Hoje é OFF**
    Entrada: a data do celular corresponde a uma linha do CSV com `tipo`
    OFF e `tempo` 0.
    Resultado esperado: o cartão "Treino de Hoje" indica claramente que é
    dia de descanso, exibindo os campos da linha (incluindo `treino`,
    que pode conter uma observação como "Descanso total" ou
    "Sem corrida (estabilidade de quadril e core)"), sem tratar isso como
    erro ou ausência de dado.

11. **Data atual ANTES do início do ciclo**
    Entrada: a data do celular é anterior à primeira data presente no CSV
    carregado.
    Resultado esperado: o app não exibe um cartão de "hoje" correspondente a
    um treino real; em vez disso, indica de forma clara que o ciclo ainda
    não começou (por exemplo, mostrando a data de início do ciclo), sem
    erro nem tela em branco. A lista do ciclo completo continua acessível
    normalmente.

12. **Data atual DEPOIS do fim do ciclo**
    Entrada: a data do celular é posterior à última data presente no CSV
    carregado.
    Resultado esperado: o app indica de forma clara que o ciclo terminou
    (por exemplo, mostrando a data de término do ciclo e sugerindo carregar
    um novo ciclo), sem erro nem tela em branco. A lista do ciclo completo
    continua acessível normalmente.

13. **Amanhã cai fora do ciclo (último dia do ciclo é hoje)**
    Entrada: a data do celular corresponde à última linha do CSV.
    Resultado esperado: o cartão "Treino de Hoje" é exibido normalmente; o
    cartão "Treino de Amanhã" indica que não há dado para o dia seguinte
    (fora do ciclo carregado), em vez de mostrar um cartão vazio ou quebrado.

14. **Consulta ao ciclo completo**
    Entrada: a usuária, com um ciclo carregado, navega até a lista/seção do
    ciclo completo.
    Resultado esperado: todos os dias do CSV são exibidos em ordem
    cronológica, com os campos como estão no arquivo (sem cálculo de
    carga/monotonia/tensão), permitindo rolagem por todo o ciclo.

15. **Uso offline após primeiro carregamento**
    Entrada: a usuária já carregou um CSV, instalou o app na tela inicial
    (PWA) e depois abre o app sem conexão à internet.
    Resultado esperado: o app abre normalmente e exibe os cartões de
    hoje/amanhã e o ciclo completo a partir dos dados salvos no
    `localStorage`, sem exigir conexão.
