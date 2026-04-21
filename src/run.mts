#!/usr/bin/env node

import { initHusky } from '~/actions/initHusky.mts';
import { installPackages } from '~/actions/installPackages.mts';
import { syncLockfileWithPackageManager } from '~/actions/syncLockfileWithPackageManager.mjs';
import { updatePackageJson } from '~/actions/updatePackageJson.mts';
import { writeBiomeConfig } from '~/actions/writeBiomeConfig.mts';
import { writeVSCodeSettings } from '~/actions/writeVsCodeSettings.mts';
import { command, commands } from '~/utils/args.mts';
import { cliMessages, HELP_MESSAGE } from '~/utils/constants.mts';
import { flags } from '~/utils/flags.mts';
import { detectPackageManager } from '~/utils/packageManager.mts';

if (flags.help) {
  console.log(HELP_MESSAGE);
  process.exit(0);
}

if (command) {
  if (command === commands.detect_pkg_mgr) {
    console.log(detectPackageManager());
    process.exit(0);
  } else {
    console.error(cliMessages.invalidCommand(command));
    process.exit(1);
  }
}

await syncLockfileWithPackageManager();
await installPackages();
await writeBiomeConfig();
await updatePackageJson();
await initHusky();
await writeVSCodeSettings();
