import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/engse203-student-labs-68543210017-8/labs/week-04/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
})