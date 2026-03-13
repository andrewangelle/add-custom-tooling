import { args } from '~/utils/args.mts';
import type { PackageManager } from './packageManager.mts';

type Flags = {
  directory: string;
  package_manager: PackageManager;
};

const defaultFlags: Flags = {
  directory: '.',
  package_manager: 'npm',
};

export const flags: Flags = Object.entries(args ?? defaultFlags).reduce(
  (acc, [key, value]) => {
    key = key.replace(/^--/, '');
    key = key.replace(/-/g, '_');
    acc[key] = value as string;
    return acc;
  },
  {} as Flags,
);
