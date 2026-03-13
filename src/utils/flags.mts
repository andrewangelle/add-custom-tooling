import { args } from '~/utils/args.mts';
import type { PackageManager } from './packageManager.mts';

type Flags = {
  directory: string;
  package_manager: PackageManager;
  help?: boolean;
};

const defaultFlags: Flags = {
  directory: '.',
  package_manager: 'npm',
};

const merged: Record<string, unknown> = {
  ...defaultFlags,
  ...(args as Record<string, unknown>),
};

export const flags: Flags = Object.entries(merged).reduce((acc, [key, value]) => {
  key = key.replace(/^--/, '');
  key = key.replace(/-/g, '_');
  (acc as Record<string, unknown>)[key] = value;
  return acc;
}, {} as Flags);
