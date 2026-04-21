import { existsSync } from 'node:fs';
import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import {
  detectPackageManager,
  lockfiles,
  type PackageManager,
} from '~/utils/packageManager.mjs';
import { workingDir } from '~/utils/paths.mts';

export async function syncLockfileWithPackageManager() {
  const detected = detectPackageManager();
  if (isPackageManagerDetected(detected) && hasMismatchedLockfile(detected)) {
    cleanMismatchedLockfiles(detected);
  }
}

function isPackageManagerDetected(arg?: string | null): arg is PackageManager {
  return !!arg;
}

function hasMismatchedLockfile(arg?: PackageManager | null) {
  return (Object.values(lockfiles).flat() as string[])
    .filter((file) => arg && file !== lockfiles[arg]?.[0])
    .some((file) => existsSync(join(workingDir, file)));
}

async function cleanMismatchedLockfiles(
  selected: PackageManager,
): Promise<void> {
  const entries = await readdir(workingDir).catch(() => [] as string[]);
  if (!entries.length) return;

  const keep = new Set(lockfiles[selected] ?? []);

  await Promise.all(
    (Object.values(lockfiles).flat() as string[])
      .filter((file) => !keep.has(file) && entries.includes(file))
      .map(async (file) => {
        const target = join(workingDir, file);
        await rm(target).catch(() => {});
      }),
  );
}
