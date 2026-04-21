import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringifyJSON } from '~/utils/json.mts';
import type { PackageManager } from '~/utils/packageManager.mts';

export const __dirname = dirname(fileURLToPath(import.meta.url));

export function setupTempProject() {
  const originalNpmCfgUsrAgt = process.env.npm_config_user_agent;
  let tempDirPath: string;

  return {
    async create(opts?: { pkgManager: PackageManager }) {
      process.env.npm_config_user_agent = '';
      tempDirPath = await mkdtemp(join(tmpdir(), 'add-tooling-'));

      await writeFile(
        join(tempDirPath, 'package.json'),
        stringifyJSON({
          name: 'temp-project',
          version: '1.0.0',
        }),
        'utf8',
      );

      if (opts?.pkgManager) {
        switch (opts.pkgManager) {
          case 'npm':
            await writeFile(
              join(tempDirPath, 'package-lock.json'),
              stringifyJSON({}),
              'utf8',
            );
            break;
          case 'pnpm':
            await writeFile(join(tempDirPath, 'pnpm-lock.yaml'), '', 'utf8');
            break;
          case 'yarn':
            await writeFile(join(tempDirPath, 'yarn.lock'), '', 'utf8');
            break;
          case 'bun':
            await writeFile(join(tempDirPath, 'bun.lockb'), '', 'utf8');
            break;
        }
      }

      // Ensure the husky directory exists so our implementation can
      // overwrite the pre-commit file even if the husky CLI fails.
      await mkdir(join(tempDirPath, '.husky'), { recursive: true });
      await mkdir(join(tempDirPath, '.vscode'), { recursive: true });
    },
    async clean() {
      await rm(tempDirPath, { recursive: true, force: true });
      tempDirPath = '';
      process.env.npm_config_user_agent = originalNpmCfgUsrAgt;
    },
    getTempDir() {
      return tempDirPath;
    },
  };
}
