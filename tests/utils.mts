import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const __dirname = dirname(fileURLToPath(import.meta.url));

export function stringifyJSON(arg: object): string {
  return JSON.stringify(arg, null, 2);
}

export function setupTempProject() {
  let tempDir: string;

  return {
    async create() {
      tempDir = await mkdtemp(join(tmpdir(), 'add-tooling-'));

      await writeFile(
        join(tempDir, 'package.json'),
        stringifyJSON({
          name: 'temp-project',
          version: '1.0.0',
        }),
        'utf8',
      );

      // Ensure the husky directory exists so our implementation can
      // overwrite the pre-commit file even if the husky CLI fails.
      await mkdir(join(tempDir, '.husky'), { recursive: true });
      await mkdir(join(tempDir, '.vscode'), { recursive: true });
    },
    async clean() {
      await rm(tempDir, { recursive: true, force: true });
      tempDir = '';
    },
    getTempDir() {
      return tempDir;
    },
  };
}
