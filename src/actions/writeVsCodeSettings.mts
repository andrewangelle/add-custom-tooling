import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import vsCodeSettings from '../templates/vscode_settings.json' with {
  type: 'json',
};
import { workingDir } from '../utils.mts';

export async function writeVSCodeSettings() {
  const vsCodeSettingsFile = path.resolve(
    workingDir,
    './.vscode/settings.json',
  );
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
    contents = vsCodeSettings;
  }

  await writeFile(vsCodeSettingsFile, JSON.stringify(contents));
}
