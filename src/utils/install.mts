import type { ExecuteOptions } from '~/utils/execute.mjs';
import { execute } from '~/utils/execute.mjs';
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
