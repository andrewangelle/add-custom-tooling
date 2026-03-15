import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { execa } from 'execa';
import { __dirname, setupTempProject } from '~tests/utils.mts';

const { create, clean, getTempDir } = setupTempProject();

describe('add-tooling integration', () => {
  beforeEach(create);
  afterEach(clean);

  it('configures a project', async () => {
    const tempDir = getTempDir();
    const packageJsonPath = join(tempDir, 'package.json');
    const cliEntry = resolve(__dirname, '../dist/run.mjs');

    await execa('node', [cliEntry, '--directory', '.'], {
      cwd: tempDir,
      env: {
        // Prefer pnpm when running under pnpm, but allow fallback to npm.
        ...process.env,
        npm_config_user_agent:
          process.env.npm_config_user_agent ?? 'pnpm/9.0.0 node/v22.0.0',
      },
    });

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
    const biomeConfig = await readFile(join(tempDir, 'biome.json'), 'utf8');
    expect(biomeConfig.length).toBeGreaterThan(0);

    // husky
    const huskyPreCommit = await readFile(
      join(tempDir, '.husky', 'pre-commit'),
      'utf8',
    );
    expect(huskyPreCommit).toContain('lint-staged');

    // vscode
    const vsCodeSettings = await readFile(
      join(tempDir, '.vscode', 'settings.json'),
      'utf8',
    );
    expect(vsCodeSettings.length).toBeGreaterThan(0);
  });
});
