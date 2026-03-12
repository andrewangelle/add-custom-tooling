import path from 'node:path';
import arg from 'arg';
import { execa, type Options } from 'execa';
import { detectPackageManager } from './detectPackageManager.mts';

type ExecuteOptions = Pick<Options, 'cwd'>;

type Flags = Record<'directory', string>;

export const args = arg({
  '--directory': String,
  '-d': '--directory',
});

export const flags: Flags = Object.entries(args).reduce((acc, [key, value]) => {
  key = key.replace(/^--/, '');
  acc[key] = value;
  return acc;
}, {} as Flags);

export const codeDir = path.resolve(
  import.meta.dirname,
  process.cwd(),
  '../..',
);
export const workingDir = path.resolve(codeDir, flags.directory);

export async function execute(
  command: string,
  ...args: (string | ExecuteOptions)[]
) {
  try {
    let options: ExecuteOptions = {};
    let cmdArgs = args;

    const last = args[args.length - 1];

    if (last && typeof last === 'object' && !Array.isArray(last)) {
      options = last as ExecuteOptions;
      cmdArgs = args.slice(0, -1);
    }

    const script = execa(command, cmdArgs as string[], {
      env: { FORCE_COLOR: '1' },
      ...options,
    });

    for await (const line of script) {
      console.log(line);
    }

    return 'completed successfully';
  } catch (error) {
    console.error('command failed:', (error as Error).message);
    return `command failed: ${(error as Error).message}`;
  }
}

export async function install(command: string, cwd?: string) {
  const packageManager = detectPackageManager();
  const options: ExecuteOptions | undefined = cwd ? { cwd } : undefined;
  if (options) {
    await execute(packageManager, 'i', '-D', command, options);
  } else {
    await execute(packageManager, 'i', '-D', command);
  }
}
