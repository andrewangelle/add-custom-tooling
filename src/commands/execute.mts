import { execa, type Options } from 'execa';

export type ExecuteOptions = Pick<Options, 'cwd'>;

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

