import { existsSync } from 'node:fs';
import { readFile,  writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import PackageJson from '@npmcli/package-json';
import arg from 'arg';
import invariant from './invariant.mts';
import biomeConfig from './templates/biome_json.json' with { type: 'json' };
import pkgJsonUpdates from './templates/package_json.json' with {
  type: 'json',
};
import vsCodeSettings from './templates/vscode_settings.json' with { type: 'json' }
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

run();

async function run() {
  await installPackages();
  await writeBiomeConfig();
  await updatePackageJson();
  await initHusky();
  await writeVSCodeSettings();
}

/**
 * Implementation
 */
async function installPackages() {
  // Check that the directory we intend to write to exists
  const noWorkingDirMessage = `Directory does not exist. Received \`${flags.directory}\` for directory`;
  invariant(existsSync(workingDir), noWorkingDirMessage);

  // install tooling dependencies
  await execute('cd', workingDir);
  await install('husky');
  await install('@biomejs/biome');
  await install('lint-staged');
}

async function writeBiomeConfig() {
  // write biome config file 
  await writeFile(
    path.resolve(workingDir, './biome.json'),
    JSON.stringify(biomeConfig),
  );
}

async function updatePackageJson() {
  // check that package.json file exists
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

async function writeVSCodeSettings() {
  const vsCodeSettingsFile = path.resolve(workingDir, './.vscode/settings.json');
  let contents: object

  if(existsSync(vsCodeSettingsFile)){
    const existing = await readFile(vsCodeSettingsFile, {encoding: 'utf-8'});
    const existingJson = JSON.parse(existing);
    contents = {
      ...existingJson,
      ...vsCodeSettings 
    }
  } else {
    contents = vsCodeSettings
  }

  await writeFile(vsCodeSettingsFile, JSON.stringify(contents))
}
