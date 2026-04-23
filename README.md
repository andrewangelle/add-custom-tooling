# add-custom-tooling

A cli tool to automate configuring repositories the local machine with preferred tooling.


## Set up

Clone the repo: 
```sh
$ git clone https://github.com/andrewangelle/add-custom-tooling.git
```

Install dependencies:

```sh
$ corepack enable
```

```sh
$ corepack install
```

Build the project:

```sh
$ pnpm build
```

Install the cli globally:
```sh
$ npm i -g .
```

## Usage
```sh
$  add-tooling [options] [command]
```

## Options:
  `-d`, `--directory <path>` 
  Target project directory (default: .)
  
  `-p`, `--package-manager <name>`  
  Package manager: npm, pnpm, yarn, bun (default: npm)
  
  `-h, --help`                    
  Show this help message

## Commands:
_Note: Passing no command is default and will run the tool. The following are optional_ 

  `detect-pkg-mgr`
  Which package manager is being used in the project?

## Features

- Linting and formatting with [Biome](https://biomejs.dev/)
- Git hooks with [Husky](https://typicode.github.io/husky/)
- Sets up a pre commit hook to run linter and formatter with [lint-staged](https://github.com/lint-staged/lint-staged)
- Sets up vscode settings for biome and auto save
- Supports tailoring the configuration for different package managers: `npm`, `pnpm`, `yarn`, `bun`