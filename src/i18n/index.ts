import en from "./en.json";

export type Locale = "en";
export type NestedDict = { [key: string]: string | NestedDict };
export type Dict = typeof en;

const dicts: Record<Locale, Dict> = { en };
let currentLocale: Locale = "en";

export function setLocale(locale: Locale) {
  if (dicts[locale]) currentLocale = locale;
}

export function t(path: string, vars?: Record<string, string | number>): string {
  const keys = path.split(".");
  let val: unknown = dicts[currentLocale];
  for (const k of keys) {
    if (typeof val !== "object" || val === null) return path;
    val = (val as NestedDict)[k];
  }
  if (typeof val !== "string") return path;
  if (!vars) return val;
  return val.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export { dicts };
