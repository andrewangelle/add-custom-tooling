import arg from 'arg';

export const args = arg({
  '--directory': String,
  '--package-manager': String,
  '-d': '--directory',
  '-p': '--package-manager',
});
