import { flags } from '~/utils/flags.mts';

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

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
  if (!npm_config_user_agent && !package_manager) return 'npm';
  try {
    const detected = npm_config_user_agent || package_manager;
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

export function getPackageExec(): string {
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

export function getScriptRun(): string {
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
