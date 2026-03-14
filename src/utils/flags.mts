import { args } from '~/utils/args.mts';
import type { PackageManager } from '~/utils/packageManager.mts';

type Flags = {
  directory: string;
  package_manager: PackageManager;
  help?: boolean;
};

const defaultFlags: Flags = {
  directory: '.',
  package_manager: 'npm',
};

const merged: Flags = {
  ...defaultFlags,
  ...args,
};

export const flags: Flags = Object.entries(merged).reduce(
  (acc, [key, value]) => {
    key = key.replace(/^--/, '');
    key = key.replace(/-/g, '_');
    acc[key] = value;
    return acc;
  },
  {} as Flags,
);
