import type { ExecuteOptions } from '~/commands/execute.mts';
import { execute } from '~/commands/execute.mts';
import { getPackageManager } from '~/utils/packageManager.mts';

export async function install(command: string, cwd?: string) {
  const packageManager = getPackageManager();
  const options: ExecuteOptions | undefined = cwd ? { cwd } : undefined;
  if (options) {
    await execute(packageManager, 'i', '-D', command, options);
  } else {
    await execute(packageManager, 'i', '-D', command);
  }
}
