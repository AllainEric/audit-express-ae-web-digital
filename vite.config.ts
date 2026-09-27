import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 👈 L'importation manquante est ici

export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // On s'assure que le plugin est bien activé
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
