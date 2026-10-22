import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // `vite build --mode android`: build para empaquetar dentro de la app Android.
  // Se sirve desde https://appassets.androidplatform.net/www/ y va sin service worker
  // ni manifest: dentro del APK no hacen falta y así no quedan cachés viejas.
  const isAndroid = mode === 'android'

  return {
    base: isAndroid ? '/www/' : '/',
    build: { outDir: isAndroid ? 'dist-android' : 'dist' },
    plugins: [
      react(),
      tailwindcss(),
      ...(isAndroid
        ? []
        : [
            VitePWA({
              registerType: 'autoUpdate',
              includeAssets: ['favicon.svg'],
              manifest: {
                name: 'Progreso Sobrio',
                short_name: 'Progreso',
                description: 'Acompaña el día a día de una persona en proceso de abstinencia de sustancias.',
                lang: 'es-CL',
                theme_color: '#5B9279',
                background_color: '#FAF6F0',
                display: 'standalone',
                start_url: '/',
                icons: [
                  { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                  { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                  { src: 'maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
                  { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                ],
              },
            }),
          ]),
    ],
    test: {
      globals: true,
      environment: 'node',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/main.tsx',
          'src/App.tsx',
          '**/*.d.ts',
          '**/*.config.*',
          '**/mockData',
          'dist/',
          'dist-android/',
        ],
      },
    },
  }
})
