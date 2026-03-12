import { writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import biomeConfig from '../templates/biome_json.json' with { type: 'json' };
import { workingDir } from '../utils.mts';

export async function writeBiomeConfig() {
  await writeFile(
    path.resolve(workingDir, './biome.json'),
    JSON.stringify(biomeConfig),
  );
}
