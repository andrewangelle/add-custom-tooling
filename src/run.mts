import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";
import PackageJson from "@npmcli/package-json";
import arg from 'arg';
import { installCmd } from './installCmd.mts'

type Flags = Record<'directory', string>

const args = arg(
  {
    "--directory": String,
    "-d": "--directory"
  }
)

const flags: Flags = Object.entries(args).reduce((acc, [key, value]) => {
  key = key.replace(/^--/, "");
  acc[key] = value;
  return acc;
}, {} as Flags);


// navigate to directory arg 
// install husky
// install @biomejs/biome
// install lint staged

// write biome.json from template folder
// update package json from template folder

// run husky init

// navigate to ./.husky 
// overwrite the pre-commit file with '$packageManager lint-staged'