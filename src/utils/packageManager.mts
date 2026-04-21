import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { flags } from '~/utils/flags.mts';
import { workingDir } from '~/utils/paths.mts';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export const lockfiles: Record<PackageManager, string[]> = {
  npm: ['package-lock.json'],
  pnpm: ['pnpm-lock.yaml'],
  yarn: ['yarn.lock'],
  bun: ['bun.lockb'],
};

/**
 * Determine which package manager the user prefers.
 *
 * npm, pnpm and Yarn set the user agent environment variable
 * that can be used to determine which package manager ran
 * the command.
 */
export function getPackageManager(): PackageManager {
  return detectPackageManager();
}

export function getPackageManagerRemoteExec(): string {
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

export function getPackageManagerExec(): string {
  switch (getPackageManager()) {
    case 'bun':
      return 'bunx';
    case 'npm':
      return 'npm exec';
    case 'pnpm':
      return 'pnpm exec';
    case 'yarn':
      return 'yarn';
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

export function detectPackageManager(): PackageManager {
  const { npm_config_user_agent } = process.env;
  const { package_manager } = flags;
  const userDefined = npm_config_user_agent || package_manager;

  if (userDefined) {
    return userDefined as PackageManager;
  }

  const matchedLockfile = Object.values(lockfiles)
    .flat()
    .filter((file) => existsSync(join(workingDir, file)));

  const [detected] =
    Object.entries(lockfiles).find(([_, files]) =>
      files.includes(matchedLockfile[0]),
    ) ?? [];

  return (detected ?? 'npm') as PackageManager;
}
