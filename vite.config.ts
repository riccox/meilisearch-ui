import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc'; // https://vitejs.dev/config/
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.debug('print current base path', env.BASE_PATH);
  return {
    base: env.BASE_PATH || '/',
    plugins: [
      react(),
      VitePWA({
        registerType: 'prompt',
        manifest: {
          short_name: 'Meili-UI',
          id: 'meilisearch-ui',
          lang: 'zh',
          icons: [
            {
              src: 'favicon.ico',
              sizes: '48x48',
            },
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
            },
            {
              src: 'apple-touch-icon-180x180.png',
              sizes: '180x180',
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
    server: {
      host: true,
      port: 24900,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // node_modules is mostly the main reason for the large chunk problem,
            // With this you're telling Vite to treat the used modules separately.
            // To understand better what it does,
            // try to compare the logs from the build command with and without this change.
            if (id.includes('node_modules')) {
              const importStrArr = id.toString().split('node_modules/');
              return importStrArr[importStrArr.length - 1].split('/')[0].toString();
            }
          },
        },
      },
    },
  };
});
