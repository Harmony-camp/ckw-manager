import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import topLevelAwait from 'vite-plugin-top-level-await'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),topLevelAwait({
    // The export name of top-level await promise for each chunk module
    promiseExportName: '__tla',
    // The function to generate import names of top-level await promise in each chunk module
    promiseImportName: i => `__tla_${i}`
  })],
  server:{
    proxy:{
      "/api":{
        target:"http://127.0.0.1:3355",
        changeOrigin:true
      }
    },
    ho
  }
})
