
import { detectPackageManager } from "./detectPackageManager.mts";
import { execa } from 'execa';


export function installCmd(command: string) {
  const packageManager = detectPackageManager();
  return async () => {
    try {
      const options = {
        env: { FORCE_COLOR: '1' }
      };

      const script = execa(packageManager, ['i', command], options);

      for await (const line of script) {
        console.log(line);
      }

      return 'completed successfully';
    } catch (error) {
      console.error('command failed:', error.message);
      return `command failed: ${error.message}`;
    }
  };
}


