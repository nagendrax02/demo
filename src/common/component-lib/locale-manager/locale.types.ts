export interface ILocaleContext {
  translate: ITranslate;
}

interface ITranslationFile {
  en: () => Promise<unknown>;
  br: () => Promise<unknown>;
  hi: () => Promise<unknown>;
  ab: () => Promise<unknown>;
  id: () => Promise<unknown>;
  la: () => Promise<unknown>;
  vi: () => Promise<unknown>;
}
export interface ILocaleProvider {
  children: JSX.Element;
  translationFile: ITranslationFile;
}

export interface ILanguageStore {
  language: string;
  setLanguage: (language: string) => void;
}
type ITranslate = (key: string, replacementKeys?: Record<string, string>) => string;

export interface IUseTranslationProps {
  translationFile: ITranslationFile;
}

export interface IUseTranslation {
  translate: ITranslate;
}
export interface IUseLocale {
  translate: ITranslate;
}
