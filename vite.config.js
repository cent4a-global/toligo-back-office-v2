import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // Utilisation de import.meta.dirname à la place de path.resolve et __dirname
            '@': import.meta.dirname + '/src',
        },
    },
})
