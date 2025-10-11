import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // replace REPO_NAME with your repo’s name
  base: '/', 
})