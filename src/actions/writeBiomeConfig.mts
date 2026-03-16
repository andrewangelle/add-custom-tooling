import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import biomeConfig from '~/templates/biome_json.json' with { type: 'json' };
import { workingDir } from '~/utils/paths.mts';

export async function writeBiomeConfig() {
  await writeFile(
    resolve(workingDir, './biome.json'),
    JSON.stringify(biomeConfig),
  );
}
