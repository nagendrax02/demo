const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const postcss = require('rollup-plugin-postcss');
const alias = require('@rollup/plugin-alias');
const svg = require('rollup-plugin-svg');
const styles = require('rollup-plugin-styles');

module.exports = {
  input: 'src/export-components.ts',
  output: [
    {
      format: 'esm',
      dir: './build',
      exports: 'named',
      preserveModules: true, // indicate not create a single-file
      preserveModulesRoot: 'src' // optional but useful to create a more plain folder structure
    }
  ],
  external: ['react', 'react-dom', /node_modules/, '.pnpm'],
  plugins: [
    peerDepsExternal({}),
    resolve(),
    commonjs(),
    postcss(),
    svg(),
    alias({
      entries: [{ find: 'preact/compat', replacement: 'react' }]
    }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          noEmit: false,
          declaration: true,
          composite: true
        },
        exclude: ['**/__tests__', '**/*.test.ts', '**/*.test.tsx']
      },
      rollupCommonJSResolveHack: false,
      clean: true
    }),
    styles({
      include: ['src/apps/entity-details/vcard-styles/vcard-styles.module.css']
    })
  ]
};
