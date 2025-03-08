import { IAugmentedAttributes } from 'apps/entity-details/types/entity-data.types';
import { create } from 'zustand';
interface IEntityAttributeDetailsState {
  searchValue: string;
  setSearchValue: (value: string) => void;
  hideFields: boolean;
  setHideFields: (hide: boolean) => void;
  augmentedAttributes: IAugmentedAttributes[];
  setAugmentedAttributes: (attributes: IAugmentedAttributes[]) => void;
  count: number;
  setCount: (count: number) => void;
  matchedCount: number;
  setMatchedHighlightCount: (count: number) => void;
}

const initialState: IEntityAttributeDetailsState = {
  searchValue: '',
  setSearchValue: () => {},
  hideFields: true,
  setHideFields: () => {},
  augmentedAttributes: [],
  setAugmentedAttributes: () => {},
  count: 0,
  setCount: () => {},
  matchedCount: 0,
  setMatchedHighlightCount: () => {}
};

const useEntityAttributeDetailsStore = create<IEntityAttributeDetailsState>((set) => ({
  ...initialState,
  setSearchValue: (value: string): void => {
    set(() => ({ searchValue: value }));
  },
  setHideFields: (hide: boolean): void => {
    set(() => ({ hideFields: hide }));
  },
  setAugmentedAttributes: (attributes: IAugmentedAttributes[]): void => {
    set(() => ({ augmentedAttributes: attributes }));
  },
  setCount: (count: number): void => {
    set(() => ({ count }));
  },
  setMatchedHighlightCount: (matchedCount: number): void => {
    set(() => ({ matchedCount: matchedCount }));
  },
  reset: (): void => {
    set(initialState);
  }
}));

export { useEntityAttributeDetailsStore };
