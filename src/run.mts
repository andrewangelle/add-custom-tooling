import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import PackageJson from '@npmcli/package-json';
import arg from 'arg';
import invariant from './invariant.mts';
import biomeConfig from './templates/biome_json.json' with { type: 'json' };
import pkgJsonUpdates from './templates/package_json.json' with {
  type: 'json',
};
import { execute, install } from './utils.mts';

type Flags = Record<'directory', string>;

const args = arg({
  '--directory': String,
  '-d': '--directory',
});

const flags: Flags = Object.entries(args).reduce((acc, [key, value]) => {
  key = key.replace(/^--/, '');
  acc[key] = value;
  return acc;
}, {} as Flags);

const codeDir = path.resolve(import.meta.dirname, process.cwd(), '..');
const workingDir = path.resolve(codeDir, flags.directory);

await installPackages();
await writeBiomeConfig();
await updatePackageJson();
await initHusky();

/**
 * Implementation
 */
async function installPackages() {
  const noWorkingDirMessage = `Directory does not exist. Received \`${flags.directory}\` for directory`;
  invariant(existsSync(workingDir), noWorkingDirMessage);
  await execute('cd', workingDir);
  await install('husky');
  await install('@biomejs/biome');
  await install('lint-staged');
}

async function writeBiomeConfig() {
  // from template folder
  await writeFile(
    path.resolve(workingDir, './biome.json'),
    JSON.stringify(biomeConfig),
  );
}

async function updatePackageJson() {
  const packageJsonPath = path.resolve(workingDir, './package.json');
  const noPackageJsonMessage = `package.json does not exist at \`${packageJsonPath}\``;

  invariant(existsSync(packageJsonPath), noPackageJsonMessage);

  const pkgJson = await PackageJson.load(workingDir);
  pkgJson.update(pkgJsonUpdates);
  await pkgJson.save();
}

async function initHusky() {
  await execute('pnpx', 'husky', 'init');

  // overwrite the husky pre-commit file with '$packageManager lint-staged'
  const huskyPreCommitFile = path.resolve(workingDir, './.husky/pre-commit');
  await writeFile(huskyPreCommitFile, 'pnpm lint-staged');
}
