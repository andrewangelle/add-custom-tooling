import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { destFiles, packageNames } from '~/utils/constants.mjs';
import { execute } from '~/utils/execute.mjs';
import {
  getPackageManagerExec,
  getPackageMangerScriptRun,
} from '~/utils/packageManager.mjs';
import { workingDir } from '~/utils/paths.mjs';

export async function initHusky() {
  // execute husky init
  await execute(getPackageManagerExec(), packageNames.husky, {
    cwd: workingDir,
  });

  // overwrite the husky pre-commit file with precommit command
  const huskyPreCommitFile = resolve(workingDir, destFiles.husky);
  const preCommitCommand = `${getPackageMangerScriptRun()} ${packageNames.lintStaged}`;
  await writeFile(huskyPreCommitFile, preCommitCommand);
}
