import { existsSync } from 'node:fs';
import invariant from '../invariant.mts';
import { flags, install, workingDir } from '../utils.mts';

export async function installPackages() {
  // Check that the directory we intend to write to exists
  const noWorkingDirMessage = `Directory does not exist. Received \`${flags.directory}\` for directory`;
  invariant(existsSync(workingDir), noWorkingDirMessage);

  // install tooling dependencies
  await install('husky', workingDir);
  await install('@biomejs/biome', workingDir);
  await install('lint-staged', workingDir);
}
