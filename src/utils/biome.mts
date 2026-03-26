import biomeConfig from '~/templates/biome_json.json' with { type: 'json' };
import {
  cliMessages,
  NPM_REGISTRY,
  packageNames,
  vars,
} from '~/utils/constants.mts';
import { stringifyJSON } from '~/utils/json.mts';

/** TYPES */
type NpmPackageMetadata = {
  'dist-tags'?: { latest?: string };
};

/** IMPLEMENTATION */
/**
 * Gets the latest biome version from the npm register
 */
export async function getLatestBiomeVersion(): Promise<string> {
  const url = `${NPM_REGISTRY}/${encodeURIComponent(packageNames.biome)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      cliMessages.failedToFetch(response.status, response.statusText),
    );
  }

  const data = (await response.json()) as NpmPackageMetadata;
  const latest = data['dist-tags']?.latest;

  if (!latest) {
    throw new Error(cliMessages.missingDistTag());
  }

  return latest;
}

/**
 * Replaces the variable placeholder in the biome config template with the latest version.
 */
export async function resolveBiomeJsonTemplate(): Promise<string> {
  const version = await getLatestBiomeVersion();
  return stringifyJSON(biomeConfig).replaceAll(vars.biomeLatest, version);
}
