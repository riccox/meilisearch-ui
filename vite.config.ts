import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc'; // https://vitejs.dev/config/

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.debug('print current base path', env.BASE_PATH);
  return {
    base: env.BASE_PATH || '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
    server: {
      host: true,
      port: 3000,
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
