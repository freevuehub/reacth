import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import babelPluginFactory from 'rollup-plugin-babel'
import external from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify'
import json from '@rollup/plugin-json'
import pkg from './package.json' assert { type: 'json' }

const extensions = ['.js', '.jsx', '.ts', '.tsx']

process.env.BABEL_ENV = 'production'

export default {
  input: './src/index.ts',
  plugins: [
    uglify(),
    typescript(),
    external(),
    nodeResolve({ extensions }),
    commonjs({ include: 'node_modules/**' }),
    babelPluginFactory({
      exclude: 'node_modules/**',
      extensions,
      include: ['src/**/*'],
      runtimeHelpers: true
    }),
    json(),
  ],
  rootDir: 'src',
  output: [
    {
      file: pkg.main,
      format: 'es',
      sourcemap: true,
    }
  ],
}
