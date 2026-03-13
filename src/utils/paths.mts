import path from 'node:path';

export const workingDir = path.resolve(import.meta.dirname, process.cwd());
