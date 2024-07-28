import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['./src'],
  format: ['esm'],
  clean: true,
  target: 'esnext',
  tsconfig: 'tsconfig.json'
})
