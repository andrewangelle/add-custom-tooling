import { writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import { execute, workingDir } from '../utils.mts';

export async function initHusky() {
  await execute('pnpx', 'husky', { cwd: workingDir });

  // overwrite the husky pre-commit file with '$packageManager lint-staged'
  const huskyPreCommitFile = path.resolve(workingDir, './.husky/pre-commit');
  await writeFile(huskyPreCommitFile, 'pnpm lint-staged');
}
