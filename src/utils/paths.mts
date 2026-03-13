import path from 'node:path';
import { flags } from '~/utils/flags.mts';

export const codeDir = path.resolve(
  import.meta.dirname,
  process.cwd(),
  '../..',
);

export const workingDir = path.resolve(codeDir, flags.directory);
