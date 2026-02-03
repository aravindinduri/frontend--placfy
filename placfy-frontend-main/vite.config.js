import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      plugins: ['styled-jsx/babel'],
    },
  }), tailwindcss()],
  server: {
    allowedHosts: ['62a2255ccaad.ngrok-free.app'], // ✅ Allow your ngrok URL
    host: true, // ✅ Needed so Vite listens on all network interfaces
    port: 5173, // (optional) customize your port
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
})
