import path from 'node:path';
import { flags } from '~/utils/flags.mts';

export const workingDir = path.resolve(process.cwd(), flags.directory);
