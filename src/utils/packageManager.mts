import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { flags } from '~/utils/flags.mts';
import { workingDir } from '~/utils/paths.mts';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

function isDetected(arg?: string | null): arg is PackageManager {
  return !!arg;
}

/**
 * Determine which package manager the user prefers.
 *
 * npm, pnpm and Yarn set the user agent environment variable
 * that can be used to determine which package manager ran
 * the command.
 */
export function getPackageManager(): PackageManager | undefined {
  const { npm_config_user_agent } = process.env;
  const { package_manager } = flags;
  const detected = npm_config_user_agent || package_manager;

  if (isDetected(detected)) {
    cleanMismatchedLockfiles(detected);
  }

  if (!detected) return 'npm';

  try {
    const pkgManager = detected.split('/')[0];
    if (pkgManager === 'npm') return 'npm';
    if (pkgManager === 'pnpm') return 'pnpm';
    if (pkgManager === 'yarn') return 'yarn';
    if (pkgManager === 'bun') return 'bun';
    return 'pnpm';
  } catch {
    return 'pnpm';
  }
}

async function cleanMismatchedLockfiles(
  selected: PackageManager,
): Promise<void> {
  const lockfiles: Record<PackageManager, string[]> = {
    npm: ['package-lock.json'],
    pnpm: ['pnpm-lock.yaml'],
    yarn: ['yarn.lock'],
    bun: ['bun.lockb'],
  };

  const entries = await readdir(workingDir).catch(() => []);
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

export function getPackageManagerExec(): string {
  switch (getPackageManager()) {
    case 'bun':
      return 'bunx';
    case 'npm':
      return 'npx';
    case 'pnpm':
      return 'pnpx';
    case 'yarn':
      return 'yarn dlx';
  }
}

export function getPackageMangerScriptRun(): string {
  switch (getPackageManager()) {
    case 'bun':
      return 'bun run';
    case 'npm':
      return 'npm run';
    case 'pnpm':
      return 'pnpm';
    case 'yarn':
      return 'yarn run';
  }
}
