import { rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';
rmSync('.build', { recursive: true, force: true });
rmSync('dist', { recursive: true, force: true });
execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.build.json'], {
  stdio: 'inherit',
});
await build({
  entryPoints: ['.build/main.js'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  packages: 'external',
  outfile: 'dist/main.mjs',
});
rmSync('.build', { recursive: true, force: true });
