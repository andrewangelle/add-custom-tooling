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
    const cmdArgs: string[] = [];

    for (const arg of args) {
      if (isExecuteOptions(arg)) {
        options = { ...options, ...arg };
      } else {
        cmdArgs.push(arg);
      }
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
    const err = error as Error;
    console.error('command failed:', err.message);
    return `command failed: ${err.message}`;
  }
}
