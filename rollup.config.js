// @ts-check
import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import swc from '@rollup/plugin-swc'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

export default defineConfig({
  input: {
    sw: 'src/sw/index.ts',
    window: 'src/window/index.ts'
  },
  output: [
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: true
    },
    {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].min.js',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [commonjs(), swc(), resolve({ browser: true })]
})
