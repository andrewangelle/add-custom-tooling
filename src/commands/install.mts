import { detectPackageManager } from '../utils/packageManager.mts';
import type { ExecuteOptions } from './execute.mts';
import { execute } from './execute.mts';

export async function install(command: string, cwd?: string) {
  const packageManager = detectPackageManager();
  const options: ExecuteOptions | undefined = cwd ? { cwd } : undefined;
  if (options) {
    await execute(packageManager, 'i', '-D', command, options);
  } else {
    await execute(packageManager, 'i', '-D', command);
  }
}
