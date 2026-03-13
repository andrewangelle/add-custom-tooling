import { execa, type Options } from 'execa';

export type ExecuteOptions = Pick<Options, 'cwd'>;

function isExecuteOptions(
  options: string | ExecuteOptions,
): options is ExecuteOptions {
  return options && typeof options === 'object' && !Array.isArray(options);
}

export async function execute(
  command: string,
  ...args: (string | ExecuteOptions)[]
) {
  try {
    let options: ExecuteOptions = {};
    let cmdArgs = args;

    const lastArg = args.at(-1);

    if (isExecuteOptions(lastArg)) {
      options = lastArg;
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
