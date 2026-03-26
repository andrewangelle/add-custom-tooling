import { existsSync } from 'node:fs';
import { cliMessages, packageNames } from '~/utils/constants.mts';
import { install } from '~/utils/install.mjs';
import invariant from '~/utils/invariant.mts';
import { workingDir } from '~/utils/paths.mts';

export async function installPackages() {
  invariant(existsSync(workingDir), cliMessages.noWorkingDir);

  await install(packageNames.husky, workingDir);
  await install(packageNames.biome, workingDir);
  await install(packageNames.lintStaged, workingDir);
}
