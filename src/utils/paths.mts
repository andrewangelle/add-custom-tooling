import { resolve } from 'node:path';
import { flags } from '~/utils/flags.mts';

export const workingDir = resolve(process.cwd(), flags.directory);
