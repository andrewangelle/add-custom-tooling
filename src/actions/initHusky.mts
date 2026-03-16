import { writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import { execute } from '~/utils/execute.mjs';
import {
  getPackageManagerExec,
  getPackageMangerScriptRun,
} from '~/utils/packageManager.mjs';
import { workingDir } from '~/utils/paths.mjs';

export async function initHusky() {
  const exec = getPackageManagerExec();
  await execute(exec, 'husky', { cwd: workingDir });

  // overwrite the husky pre-commit file with '$packageManager lint-staged'
  const huskyPreCommitFile = path.resolve(workingDir, './.husky/pre-commit');
  const scriptRun = getPackageMangerScriptRun();
  await writeFile(huskyPreCommitFile, `${scriptRun} lint-staged`);
}
