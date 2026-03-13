type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

/**
 * Determine which package manager the user prefers.
 *
 * npm, pnpm and Yarn set the user agent environment variable
 * that can be used to determine which package manager ran
 * the command.
 */
export const detectPackageManager = (): PackageManager | undefined => {
  const { npm_config_user_agent } = process.env;
  if (!npm_config_user_agent) return 'pnpm';
  try {
    const pkgManager = npm_config_user_agent.split('/')[0];
    if (pkgManager === 'npm') return 'npm';
    if (pkgManager === 'pnpm') return 'pnpm';
    if (pkgManager === 'yarn') return 'yarn';
    if (pkgManager === 'bun') return 'bun';
    return 'pnpm';
  } catch {
    return 'pnpm';
  }
};
