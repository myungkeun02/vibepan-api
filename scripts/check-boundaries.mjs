import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}
const files = walk('src');
if (files.some((file) => file.endsWith('.astro'))) throw new Error('UI template in API repository');
for (const file of files) {
  if (/admin_members|admin_sessions|ADMIN_BOOTSTRAP_EMAIL/.test(readFileSync(file, 'utf8')))
    throw new Error('Private administrator implementation in service repository: ' + file);
}
console.log('Repository and browser boundaries verified.');
