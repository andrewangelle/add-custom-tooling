import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { execa } from 'execa';
import type { PackageManager } from '~/utils/packageManager.mjs';
import { __dirname, setupTempProject } from '~tests/utils.mts';

const { create, clean, getTempDir } = setupTempProject();

describe('add-tooling integration', () => {
  beforeEach(create);
  afterEach(clean);

  it('configures a project', async () => {
    const cwd = getTempDir();
    const packageJsonPath = join(cwd, 'package.json');
    const cliEntry = resolve(__dirname, '../dist/run.mjs');

    // run the command
    await execa('node', [cliEntry], { cwd });

    // package json
    const updatedPkgRaw = await readFile(packageJsonPath, 'utf8');
    const updatedPkg = JSON.parse(updatedPkgRaw) as {
      scripts?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    expect(updatedPkg.scripts).toBeDefined();
    expect(updatedPkg.scripts?.['lint:check']).toBeTypeOf('string');
    expect(updatedPkg.devDependencies).toBeDefined();
    expect(updatedPkg.devDependencies?.['@biomejs/biome']).toBeTypeOf('string');

    // biome
    const biomeConfig = await readFile(join(cwd, 'biome.json'), 'utf8');
    expect(biomeConfig.length).toBeGreaterThan(0);

    // husky
    const huskyPreCommit = await readFile(
      join(cwd, '.husky', 'pre-commit'),
      'utf8',
    );
    expect(huskyPreCommit).toContain('lint-staged');

    // vscode
    const vsCodeSettings = await readFile(
      join(cwd, '.vscode', 'settings.json'),
      'utf8',
    );
    expect(vsCodeSettings.length).toBeGreaterThan(0);
  });
});

const packageManagers = [
  'npm',
  'yarn',
  'pnpm',
  'bun',
] satisfies PackageManager[];

describe.each(packageManagers)('add-tooling detect-pkg-mgr', (pkgManager) => {
  beforeEach(async () => {
    await create({ pkgManager });
  });

  afterEach(clean);

  it(`${pkgManager}`, async () => {
    const cwd = getTempDir();
    const cliEntry = resolve(__dirname, '../dist/run.mjs');

    const result = await execa('node', [cliEntry, 'detect-pkg-mgr'], { cwd });

    expect(result.stdout).toBe(pkgManager);
  });
});
