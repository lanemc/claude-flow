const esbuild = require('esbuild');
const path = require('path');

const config = {
  entryPoints: ['dist/cli/main.js'],
  bundle: true,
  outfile: 'dist/bundle/main.js',
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  minify: true,
  sourcemap: false,
  external: [
    'better-sqlite3',
    'node-pty',
    '@modelcontextprotocol/sdk'
  ],
  banner: {
    js: '#!/usr/bin/env node'
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  loader: {
    '.node': 'file'
  },
  treeShaking: true,
  keepNames: false,
  dropLabels: ['DEV'],
  legalComments: 'none'
};

async function build() {
  try {
    console.log('Building optimized bundle with esbuild...');
    await esbuild.build(config);
    console.log('✅ Bundle created successfully at dist/bundle/main.js');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  build();
}

module.exports = { config, build };