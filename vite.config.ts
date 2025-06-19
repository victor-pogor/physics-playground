import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl';
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid(), glsl()],
})
