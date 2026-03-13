import arg from 'arg';

export const args = arg({
  '--directory': String,
  '--package-manager': String,
  '--help': Boolean,
  '-d': '--directory',
  '-p': '--package-manager',
  '-h': '--help',
});
