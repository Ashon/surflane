// What Surflane adds to a consumer's bundle: the bench dashboard's JS (bench/runtime)
// with every package but @surflane/* external, and all.css, both minified; gzip
// bytes. Run `npm run build` first. The last line is the metric: JS plus CSS gzip
// bytes, lower is better. --top N lists the N inputs that add the most to each.
//
//   node scripts/bench-size.mjs [--top 30]
import { gzipSync } from 'node:zlib'
import { build } from 'esbuild'
const args = process.argv.slice(2)
const top = Number(args[args.indexOf('--top') + 1] || 0)
const js = await build({
  entryPoints: ['bench/runtime/main.tsx'],
  bundle: true,
  write: false,
  minify: true,
  format: 'esm',
  platform: 'browser',
  metafile: true,
  logLevel: 'silent',
  loader: { '.css': 'empty' },
  jsx: 'automatic',
  plugins: [
    {
      name: 'own-only',
      setup(b) {
        b.onResolve({ filter: /^[@a-z]/ }, ({ path }) =>
          path.startsWith('@surflane/') ? undefined : { path, external: true },
        )
      },
    },
  ],
})
const css = await build({
  stdin: {
    contents: `@import '@surflane/ui/all.css';`,
    resolveDir: process.cwd(),
    loader: 'css',
  },
  bundle: true,
  write: false,
  minify: true,
  logLevel: 'silent',
  metafile: true,
  loader: { '.woff2': 'empty', '.svg': 'empty' },
})
const jsOut = js.outputFiles[0].contents,
  cssOut = css.outputFiles[0].contents
const result = {
  jsBytes: jsOut.length,
  jsGzip: gzipSync(jsOut, { level: 9 }).length,
  cssBytes: cssOut.length,
  cssGzip: gzipSync(cssOut, { level: 9 }).length,
}
result.totalGzip = result.jsGzip + result.cssGzip
if (top) {
  const inputs = Object.values(js.metafile.outputs)[0].inputs
  console.log('-- JS inputs by bytes in output')
  for (const [p, v] of Object.entries(inputs)
    .sort((a, b) => b[1].bytesInOutput - a[1].bytesInOutput)
    .slice(0, top))
    console.log(
      String(v.bytesInOutput).padStart(8),
      p.replace(/^.*packages\//, ''),
    )
  const cin = Object.values(css.metafile?.outputs ?? {})[0]?.inputs
  if (cin) {
    console.log('-- CSS inputs by bytes in output')
    for (const [p, v] of Object.entries(cin)
      .sort((a, b) => b[1].bytesInOutput - a[1].bytesInOutput)
      .slice(0, top))
      console.log(
        String(v.bytesInOutput).padStart(8),
        p.replace(/^.*packages\//, ''),
      )
  }
}
console.log(JSON.stringify(result))
console.log(result.totalGzip)
