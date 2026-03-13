import { writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import { execute } from '~/commands/execute.mts';
import { getPackageExec, getScriptRun } from '~/utils/packageManager.mjs';
import { workingDir } from '~/utils/paths.mjs';

export async function initHusky() {
  const exec = getPackageExec();
  await execute(exec, 'husky', { cwd: workingDir });

  // overwrite the husky pre-commit file with '$packageManager lint-staged'
  const huskyPreCommitFile = path.resolve(workingDir, './.husky/pre-commit');
  const scriptRun = getScriptRun();
  await writeFile(huskyPreCommitFile, `${scriptRun} lint-staged`);
}
