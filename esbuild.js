require('esbuild').buildSync({
    bundle: true,
    minify: true,
    entryPoints: ['src/index.ts'],
    outfile: 'build/cache.js',
    sourcemap: 'linked',
    platform: 'node',
})