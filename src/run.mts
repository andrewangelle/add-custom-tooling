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

const codeDir = path.resolve(import.meta.dirname, process.cwd(), '../..');
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
  await install('husky', workingDir);
  await install('@biomejs/biome', workingDir);
  await install('lint-staged', workingDir);
}

async function writeBiomeConfig() {
  await writeFile(
    path.resolve(workingDir, './biome.json'),
    JSON.stringify(biomeConfig),
  );
}

type PackageJsonContent = Awaited<
    ReturnType<typeof PackageJson.load>
  >['content'];

async function updatePackageJson() {
  // check that package.json file exists
  const packageJsonPath = path.resolve(workingDir, './package.json');
  const noPackageJsonMessage = `package.json does not exist at \`${packageJsonPath}\``;

  invariant(existsSync(packageJsonPath), noPackageJsonMessage);

  const pkgJson = await PackageJson.load(workingDir);

  // Merge scripts instead of overwriting them
  const existing = pkgJson.content as PackageJsonContent;
  const updates = pkgJsonUpdates as PackageJsonContent;
  
  const mergedScripts = {
    ...(existing.scripts ?? {}),
    ...(updates.scripts ?? {}),
  };

  // Apply all updates first, then restore merged scripts
  pkgJson.update(updates);
  pkgJson.update({ scripts: mergedScripts });

  await pkgJson.save();
}

async function initHusky() {
  await execute('pnpx', 'husky', { cwd: workingDir });

  // overwrite the husky pre-commit file with '$packageManager lint-staged'
  const huskyPreCommitFile = path.resolve(workingDir, './.husky/pre-commit');
  await writeFile(huskyPreCommitFile, 'pnpm lint-staged');
}

async function writeVSCodeSettings() {
  const vsCodeSettingsFile = path.resolve(workingDir, './.vscode/settings.json');
  let contents: object

  // if the directory already has a .vscode/settings.json then append to it with our config
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
