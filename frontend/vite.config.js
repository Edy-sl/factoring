import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        host: true,
        port: 4001, // This is the port which we will use in docker
        // Thanks @sergiomoura for the window fix
        // add the next lines if you're using windows and hot reload doesn't work
        watch: {
            usePolling: true,
        },
    },
    preview: {
        host: true,
        port: 4000, // This is the port which we will use in docker
        // Thanks @sergiomoura for the window fix
        // add the next lines if you're using windows and hot reload doesn't work
        watch: {
            usePolling: true,
        },
    },
    build: { chunkSizeWarningLimit: 1600 },
});
