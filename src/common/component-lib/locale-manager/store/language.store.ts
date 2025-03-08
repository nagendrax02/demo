import { create } from 'zustand';
import { ILanguageStore } from '../locale.types';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';

const DEFAULT_LANGUAGE = 'en';

const initialState: ILanguageStore = {
  language: getItem(StorageKey.Language) || DEFAULT_LANGUAGE,
  setLanguage: () => {}
};

export const useLanguageStore = create<ILanguageStore>((set) => ({
  ...initialState,
  setLanguage: (updatedLanguage: string): void => {
    set({ language: updatedLanguage });
    setItem(StorageKey.Language, updatedLanguage);
  }
}));
