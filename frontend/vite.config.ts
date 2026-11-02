import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite config: we add the react plugin and the tailwind plugin
export default defineConfig({
  plugins: [react(), tailwindcss()],
})