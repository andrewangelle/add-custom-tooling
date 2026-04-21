import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import vsCodeSettings from '~/templates/vscode_settings.json' with {
  type: 'json',
};
import { destFiles } from '~/utils/constants.mts';
import { workingDir } from '~/utils/paths.mts';

export async function writeVSCodeSettings() {
  const vsCodeSettingsFile = resolve(workingDir, destFiles.vscode);
  let contents: object;

  // if the directory already has a .vscode/settings.json then append to it with our config
  if (existsSync(vsCodeSettingsFile)) {
    const existing = await readFile(vsCodeSettingsFile, { encoding: 'utf-8' });
    const existingJson = JSON.parse(existing);
    contents = {
      ...existingJson,
      ...vsCodeSettings,
    };
  } else {
    // create the .vscode/settings.json file if it doesn't exist
    contents = vsCodeSettings;
    await mkdir(dirname(vsCodeSettingsFile), { recursive: true });
  }

  await writeFile(vsCodeSettingsFile, JSON.stringify(contents));
}
