import arg from 'arg';

export const args = arg(
  {
    '--directory': String,
    '--package-manager': String,
    '--help': Boolean,
    '-d': '--directory',
    '-p': '--package-manager',
    '-h': '--help',
  },
  {
    argv: process.argv.slice(2),
    permissive: true,
  },
);

export const commands = {
  detect_pkg_mgr: 'detect-pkg-mgr',
};

export const command = args._[0];
