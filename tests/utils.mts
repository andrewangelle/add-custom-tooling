import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringifyJSON } from '~/utils/json.mts';

export const __dirname = dirname(fileURLToPath(import.meta.url));

export function setupTempProject() {
  let tempDirPath: string;

  return {
    async create() {
      tempDirPath = await mkdtemp(join(tmpdir(), 'add-tooling-'));

      await writeFile(
        join(tempDirPath, 'package.json'),
        stringifyJSON({
          name: 'temp-project',
          version: '1.0.0',
        }),
        'utf8',
      );

      // Ensure the husky directory exists so our implementation can
      // overwrite the pre-commit file even if the husky CLI fails.
      await mkdir(join(tempDirPath, '.husky'), { recursive: true });
      await mkdir(join(tempDirPath, '.vscode'), { recursive: true });
    },
    async clean() {
      await rm(tempDirPath, { recursive: true, force: true });
      tempDirPath = '';
    },
    getTempDir() {
      return tempDirPath;
    },
  };
}
