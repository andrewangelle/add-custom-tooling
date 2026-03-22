export function stringifyJSON(arg: object): string {
  return JSON.stringify(arg, null, 2);
}
