import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { resolveBiomeJsonTemplate } from '~/utils/biome.mjs';
import { workingDir } from '~/utils/paths.mts';

export async function writeBiomeConfig() {
  await writeFile(
    resolve(workingDir, './biome.json'),
    await resolveBiomeJsonTemplate(),
  );
}
