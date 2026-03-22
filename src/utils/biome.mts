import biomeConfig from '~/templates/biome_json.json' with { type: 'json' };
import { stringifyJSON } from '~/utils/json.mts';

/** TYPES */
type NpmPackageMetadata = {
  'dist-tags'?: { latest?: string };
};

/** CONSTANTS */
const BIOME_PACKAGE = '@biomejs/biome';
const NPM_REGISTRY = 'https://registry.npmjs.org';
const LATEST_BIOME_PLACEHOLDER = '{{ LATEST_BIOME }}';
const getFailedToFetchMsg = (status: number, statusText: string) =>
  `Failed to fetch ${BIOME_PACKAGE} from npm (${status} ${statusText})`;
const getMissingDistTagMsg = () =>
  `npm registry response missing dist-tags.latest for ${BIOME_PACKAGE}`;

/** IMPLEMENTATION */
/**
 * Gets the latest biome version from the npm register
 */
export async function getLatestBiomeVersion(): Promise<string> {
  const url = `${NPM_REGISTRY}/${encodeURIComponent(BIOME_PACKAGE)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(getFailedToFetchMsg(response.status, response.statusText));
  }

  const data = (await response.json()) as NpmPackageMetadata;
  const latest = data['dist-tags']?.latest;

  if (!latest) {
    throw new Error(getMissingDistTagMsg());
  }

  return latest;
}

/**
 * Replaces the variable placeholder in the biome config template with the latest version.
 */
export async function resolveBiomeJsonTemplate(): Promise<string> {
  const version = await getLatestBiomeVersion();
  return stringifyJSON(biomeConfig).replaceAll(
    LATEST_BIOME_PLACEHOLDER,
    version,
  );
}
