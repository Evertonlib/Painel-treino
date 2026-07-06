# Sistema Ritmo Certo

PWA leve para consulta rápida do treino de hoje e de amanhã, a partir de um ciclo de treino exportado em CSV. Feito para ser aberto no celular como um app instalado, sem backend: todo o ciclo carregado fica salvo no `localStorage` do navegador.

## Como funciona

1. Na primeira abertura, o app pede para carregar um arquivo CSV do ciclo de treino.
2. O CSV é parseado (PapaParse), validado e normalizado em memória, depois salvo no `localStorage` (`treinoDoDia:ciclo:v1`).
3. Comparando a data de hoje com a data de cada linha do ciclo, o app mostra:
   - Cartão de destaque com o treino de **hoje**.
   - Cartão com o treino de **amanhã**.
   - Indicador da **fase do ciclo** atual (ex.: Transição, Base, Específico).
   - Lista do **ciclo completo**, para consulta de qualquer dia.
4. Caso a data de hoje esteja fora do intervalo do ciclo (antes do início ou depois do fim), é exibido um cartão informativo no lugar dos treinos.
5. O botão "Atualizar" no cabeçalho permite recarregar/substituir o ciclo com um novo CSV a qualquer momento.

### Formato esperado do CSV

Colunas obrigatórias (nomes normalizados para minúsculas, sem acento):

| Coluna  | Descrição                                             |
|---------|--------------------------------------------------------|
| `fase`  | Nome da fase do ciclo (ex.: Transição, Base, Choque)   |
| `data`  | Data no formato `dd/mm/aa`                             |
| `dia`   | Abreviação do dia da semana (ex.: Seg, Ter)             |
| `tipo`  | Tipo/zona do treino (ex.: `Z2`, `Z4 LT2`, `Z5 VO2`, `OFF`, `Força`) |
| `treino`| Descrição textual do treino do dia                      |
| `tempo` | Duração em minutos                                      |
| `rpe`   | Percepção de esforço                                    |
| `forca` | Descrição do treino de força complementar (opcional)    |

Um exemplo real está em [`dados_do_ciclo.csv`](dados_do_ciclo.csv). Linhas com data inválida/ausente ainda são exibidas na lista do ciclo completo, mas ficam fora da lógica de "hoje/amanhã".

O campo `tipo` também define a cor do cartão e a posição na régua de zonas (Z1–Z5, Força, OFF), calculada em [`src/lib/estiloTreino.js`](src/lib/estiloTreino.js).

## Stack

- **React 19** + **Vite** — SPA
- **Tailwind CSS** — estilização (tema claro/escuro com paleta "giz"/"grafite"/"pista")
- **PapaParse** — parsing de CSV
- **vite-plugin-pwa** (Workbox) — service worker, manifest e instalação como PWA
- **oxlint** — lint

## Estrutura do projeto

```
src/
├── App.jsx                        # Roteamento de estado da tela + composição do layout
├── components/
│   ├── TelaCarregarCiclo.jsx       # Tela inicial de upload do CSV
│   ├── BotaoCarregarCiclo.jsx      # Botão de (re)carregar ciclo
│   ├── BotaoAlternarTema.jsx       # Toggle claro/escuro
│   ├── CartaoTreino.jsx            # Cartão de treino (hoje/amanhã)
│   ├── CartaoCicloForaDoIntervalo.jsx # Estados de "antes do início" / "depois do fim" / "sem amanhã"
│   ├── ListaCicloCompleto.jsx      # Lista de todos os dias do ciclo
│   ├── ItemDiaCiclo.jsx            # Linha individual da lista
│   ├── FaseCiclo.jsx               # Indicador de progresso entre fases
│   ├── ReguaZona.jsx               # Régua visual de zona de treino (Z1–Z5)
│   ├── MensagemErro.jsx            # Exibição de erros de carregamento
│   └── icones.jsx                  # Ícones SVG usados na UI
├── lib/
│   ├── parseCsv.js                 # Leitura e validação do CSV (colunas obrigatórias)
│   ├── modeloCiclo.js              # Normalização das linhas do CSV em registros do ciclo
│   ├── armazenamentoLocal.js       # Persistência do ciclo no localStorage
│   ├── datas.js                    # Utilidades de data (hoje/amanhã, parse dd/mm/aa, ISO)
│   ├── estiloTreino.js             # Cor/posição na régua de zona a partir do campo `tipo`
│   └── tema.js                     # Lógica de tema claro/escuro
└── styles/index.css
```

Documentação de produto: [`PRD_APP_TREINO_DO_DIA.md`](PRD_APP_TREINO_DO_DIA.md) e [`SPEC_APP_TREINO_DO_DIA.md`](SPEC_APP_TREINO_DO_DIA.md).

## Rodando localmente

```bash
npm install
npm run dev
```

Outros scripts disponíveis:

```bash
npm run build     # build de produção em dist/
npm run preview   # serve o build localmente
npm run lint      # oxlint
npm run deploy    # build + publica dist/ no GitHub Pages (gh-pages)
```

## Deploy

O app é publicado como PWA estático no GitHub Pages, com `base: '/Painel-treino/'` configurado em [`vite.config.js`](vite.config.js). `npm run deploy` faz o build e publica a pasta `dist/` via `gh-pages`.
