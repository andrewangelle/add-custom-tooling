#!/usr/bin/env node

import { initHusky } from '~/actions/initHusky.mts';
import { installPackages } from '~/actions/installPackages.mts';
import { updatePackageJson } from '~/actions/updatePackageJson.mts';
import { writeBiomeConfig } from '~/actions/writeBiomeConfig.mts';
import { writeVSCodeSettings } from '~/actions/writeVsCodeSettings.mts';
import { flags } from '~/utils/flags.mts';

if (flags.help) {
  console.log(`add-tooling

Usage:
  add-tooling [options]

Options:
  -d, --directory <path>        Target project directory (default: .)
  -p, --package-manager <name>  Package manager: npm, pnpm, yarn, bun (default: npm)
  -h, --help                    Show this help message
`);
  process.exit(0);
}

await installPackages();
await writeBiomeConfig();
await updatePackageJson();
await initHusky();
await writeVSCodeSettings();
