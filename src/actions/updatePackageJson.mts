import { existsSync } from 'node:fs';
import * as path from 'node:path';
import PackageJson from '@npmcli/package-json';
import pkgJsonUpdates from '~/templates/package_json.json' with {
  type: 'json',
};
import invariant from '~/utils/invariant.mts';
import { getPackageExec, getScriptRun } from '~/utils/packageManager.mts';
import { workingDir } from '~/utils/paths.mts';

export type PackageJsonContent = Awaited<
  ReturnType<typeof PackageJson.load>
>['content'];

export async function updatePackageJson() {
  // check that package.json file exists
  const packageJsonPath = path.resolve(workingDir, './package.json');
  const noPackageJsonMessage = `package.json does not exist at \`${packageJsonPath}\``;

  invariant(existsSync(packageJsonPath), noPackageJsonMessage);

  const pkgJson = await PackageJson.load(workingDir);

  // Merge scripts instead of overwriting them
  const existing = pkgJson.content as PackageJsonContent;
  const updates = getScriptsContents();

  const mergedScripts = {
    ...(existing.scripts ?? {}),
    ...(updates.scripts ?? {}),
  };

  // Apply all updates first, then restore merged scripts
  pkgJson.update(updates);
  pkgJson.update({ scripts: mergedScripts });

  await pkgJson.save();
}

/**
 * Replace the run scripts according to the detected package manager choice.
 * Works for nested objects and arrays (e.g. lint-staged config).
 */
function getScriptsContents(): PackageJsonContent {
  const replacePlaceholders = (value: unknown): unknown => {
    if (typeof value === 'string') {
      return value
        .replace('{{ PACKAGE_EXEC }}', getPackageExec())
        .replace('{{ PACKAGE_RUN }}', getScriptRun());
    }

    if (Array.isArray(value)) {
      return value.map(replacePlaceholders);
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, replacePlaceholders(v)]),
      );
    }

    return value;
  };

  return replacePlaceholders(pkgJsonUpdates) as PackageJsonContent;
}
