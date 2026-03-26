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

function normalizeFlagKey(key: string): keyof Flags | undefined {
  const normalized = key.replace(/^--/, '').replace(/-/g, '_');

  if (normalized === 'directory') return 'directory';
  if (normalized === 'package_manager') return 'package_manager';
  if (normalized === 'help') return 'help';

  return undefined;
}

export const flags: Flags = Object.entries(merged).reduce(
  (acc, [key, value]) => {
    const normalizedKey = normalizeFlagKey(key);
    if (!normalizedKey) return acc;

    // Explicit assignments so TS can type-check the indexed writes.
    switch (normalizedKey) {
      case 'directory':
        acc.directory = value as string;
        break;
      case 'package_manager':
        acc.package_manager = value as PackageManager;
        break;
      case 'help':
        acc.help = value as boolean;
        break;
    }
    return acc;
  },
  {} as Flags,
);
