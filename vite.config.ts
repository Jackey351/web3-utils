import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { resolve } from 'path';
import inject from '@rollup/plugin-inject';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

const config = defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    // dedupe: ['react', 'react-dom'],
    alias: {
      // process: resolve(
      //   __dirname,
      //   './rollup-plugin-node-polyfills/polyfills/process-es6',
      // ),
      // stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      '@': resolve(__dirname, './src'),
      // buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6", // add buffer
      // buffer: resolve(
      //   __dirname,
      //   './node_modules/rollup-plugin-node-polyfills/polyfills/buffer-es6',
      // ),
    },
  },
  // base: '/',
  // build: {
  //   target: 'es2020',
  //   rollupOptions: {
  //     plugins: [inject({ Buffer: ['Buffer', 'buffer'] }), rollupNodePolyFill()],
  //     // external: [resolve(__dirname, './node_modules/@thirdweb-dev/storage/dist/thirdweb-dev-storage.browser.esm.js')],
  //   },
  // },
  build: {
    target: "es2020",
    rollupOptions: {
      plugins: [inject({ Buffer: ["buffer", "Buffer"] })],
      // external: ["@lit-protocol/sdk-nodejs"]
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin()
      ],
    },
  },
  esbuild: {
    jsxFactory: 'jsx',
    // jsxInject: `import { jsx } from '@emotion/react'`,
  },
  define: {
    // global: 'globalThis',
    'process.env': {
      pinataApiKey: '',
      pinataSecretApiKey: '',
      DEBUG: '',
    },
  },
  server: {
    port: 3009,
    host: '0.0.0.0',
    proxy: {
      '/create-iframe-room': {
        target: 'https://api.huddle01.com/api/v1',
        changeOrigin: true,
      },
    },
  },
});

export default config;
