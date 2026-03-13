# add-custom-tooling

A local cli tool I created to automate setting up new repositories on my local machine with my preferred tooling.


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
$  add-tooling [options]
```

## Options:
  `-d`, `--directory <path>` 
  Target project directory (default: .)
  
  `-p`, `--package-manager <name>`  
  Package manager: npm, pnpm, yarn, bun (default: npm)
  
  `-h, --help`                    
  Show this help message
