"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import en from "./en.json";
import fa from "./fa.json";
import ru from "./ru.json";

export type Locale = "en" | "fa" | "ru";
type NestedDict = { [key: string]: string | NestedDict };
type Dict = typeof en;

const dicts: Record<Locale, Dict> = { en, fa, ru };

interface LocaleCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleCtx>({
  locale: "en",
  setLocale: () => {},
  t: (p) => p,
});

function resolve(dict: Dict, path: string, vars?: Record<string, string | number>): string {
  const keys = path.split(".");
  let val: unknown = dict;
  for (const k of keys) {
    if (typeof val !== "object" || val === null) return path;
    val = (val as NestedDict)[k];
  }
  if (typeof val !== "string") return path;
  if (!vars) return val;
  return val.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("locale") as Locale) || "en";
    }
    return "en";
  });

  const switchLocale = useCallback((l: Locale) => {
    setLocale(l);
    localStorage.setItem("locale", l);
  }, []);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) =>
      resolve(dicts[locale], path, vars),
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale: switchLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
