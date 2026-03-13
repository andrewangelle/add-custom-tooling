import { args } from '~/utils/args.mts';

type Flags = Record<'directory' | 'package_manager', string>;

export const flags: Flags = Object.entries(args).reduce((acc, [key, value]) => {
  key = key.replace(/^--/, '');
  key = key.replace(/-/g, '_');
  acc[key] = value as string;
  return acc;
}, {} as Flags);
