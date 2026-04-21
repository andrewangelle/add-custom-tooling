import { flags } from '~/utils/flags.mts';

export const vars = {
  packageExec: '{{ PACKAGE_EXEC }}',
  packageRun: '{{ PACKAGE_RUN }}',
  biomeLatest: '{{ LATEST_BIOME }}',
};

export const packageNames = {
  biome: '@biomejs/biome',
  husky: 'husky',
  lintStaged: 'lint-staged',
};

export const destFiles = {
  vscode: './.vscode/settings.json',
  biome: './biome.json',
  husky: './.husky/pre-commit',
  packageJson: './package.json',
};

export const cliMessages = {
  noPackageJson: (dest: string) => `package.json does not exist at \`${dest}\``,
  failedToFetch: (status: number, statusText: string) =>
    `Failed to fetch ${packageNames.biome} from npm (${status} ${statusText})`,
  missingDistTag: () =>
    `npm registry response missing dist-tags.latest for ${packageNames.biome}`,
  noWorkingDir: `Directory does not exist. Received \`${flags.directory}\` for directory`,
  invalidCommand: (cmd: string) =>
    `[add-tooling]: Command '${cmd}' not supported. Use --help for supported options`,
};

export const HELP_MESSAGE = `add-tooling

Usage:
  add-tooling [options] [command]

Options:
  -d, --directory <path>        Target project directory (default: .)
  -p, --package-manager <name>  Package manager: npm, pnpm, yarn, bun (default: npm)
  -h, --help                    Show this help message

Commands:
  detect-pkg-mgr                Which package manager is being used in the project?
`;

export const NPM_REGISTRY = 'https://registry.npmjs.org';
