#!/usr/bin/env node

import { initHusky } from '~/actions/initHusky.mts';
import { installPackages } from '~/actions/installPackages.mts';
import { updatePackageJson } from '~/actions/updatePackageJson.mts';
import { writeBiomeConfig } from '~/actions/writeBiomeConfig.mts';
import { writeVSCodeSettings } from '~/actions/writeVsCodeSettings.mts';

await installPackages();
await writeBiomeConfig();
await updatePackageJson();
await initHusky();
await writeVSCodeSettings();
