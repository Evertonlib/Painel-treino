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
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Treino do Dia',
        short_name: 'Treino do Dia',
        description: 'Consulta rápida do treino de hoje e amanhã do seu ciclo.',
        theme_color: '#14171b',
        background_color: '#14171b',
        display: 'standalone',
        start_url: '/Painel-treino/',
        scope: '/Painel-treino/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
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
