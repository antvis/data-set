import { defineConfig } from 'tsup';
import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  entry: Object.fromEntries(
    globSync('src/transform/**/*.ts').map((file) => {
      return [
        // 这里将删除 `src/` 以及每个文件的扩展名。
        // 因此，例如 src/nested/foo.js 会变成 nested/foo
        path.relative('src', file.slice(0, file.length - path.extname(file).length)),
        // 这里可以将相对路径扩展为绝对路径，例如
        // src/nested/foo 会变成 /project/src/nested/foo.js
        fileURLToPath(new URL(file, import.meta.url)),
      ];
    })
  ),
  format: ['esm', 'cjs'],
  outDir: 'build',
  clean: true,
  dts: true,
  external: ['lodash'],
  noExternal: ['dagre', 'wolfy87-eventemitter', 'd3-sankey', 'simple-statistics', 'd3-voronoi'],
});
