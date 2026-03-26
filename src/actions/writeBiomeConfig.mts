import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { resolveBiomeJsonTemplate } from '~/utils/biome.mjs';
import { destFiles } from '~/utils/constants.mts';
import { workingDir } from '~/utils/paths.mts';

export async function writeBiomeConfig() {
  await writeFile(
    resolve(workingDir, destFiles.biome),
    await resolveBiomeJsonTemplate(),
  );
}
