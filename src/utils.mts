import { execa } from 'execa';
import { detectPackageManager } from './detectPackageManager.mts';

export async function execute(command: string, ...args: string[]) {
  try {
    const options = {
      env: { FORCE_COLOR: '1' },
    };

    const script = execa(command, args, options);

    for await (const line of script) {
      console.log(line);
    }

    return 'completed successfully';
  } catch (error) {
    console.error('command failed:', error.message);
    return `command failed: ${error.message}`;
  }
}

export async function install(command: string) {
  const packageManager = detectPackageManager();
  await execute(packageManager, 'i', '-D', command);
}
