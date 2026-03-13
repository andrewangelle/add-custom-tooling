import { args } from '~/utils/args.mts';

type Flags = Record<'directory', string>;

export const flags: Flags = Object.entries(args).reduce((acc, [key, value]) => {
  key = key.replace(/^--/, '');
  acc[key] = value as string;
  return acc;
}, {} as Flags);
