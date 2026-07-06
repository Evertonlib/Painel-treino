import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/Painel-treino/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
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
      workbox: {
        // .woff2 é suficiente para os navegadores modernos alvo do app (ver
        // PRD, seção "Premissas assumidas"); os .woff continuam no build
        // como fallback servido sob demanda, mas não entram no precache.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
    }),
  ],
})
