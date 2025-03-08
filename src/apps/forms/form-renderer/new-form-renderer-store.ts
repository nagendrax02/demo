import { getItem, StorageKey } from 'src/common/utils/storage-manager';
import { create } from 'zustand';
import { IDraft } from '../draft-menu/draft-config';
import { IFormsConfiguration } from '../forms.types';

interface IFormRenderStore {
  formsCount: number;
  formIframeRef: React.MutableRefObject<HTMLIFrameElement | null | undefined>;
  formConfig: IFormsConfiguration | null;
  showModalForms: boolean;
  setFormConfig: (formConfig: IFormsConfiguration | null) => void;
  setShowModalForms: (showModalForms: boolean) => void;
  resetFormsCount: () => void;
  setFormsRef: (ref: React.MutableRefObject<HTMLIFrameElement | null | undefined>) => void;
}

type StoreSetter = (
  partial:
    | IFormRenderStore
    | Partial<IFormRenderStore>
    | ((state: IFormRenderStore) => IFormRenderStore | Partial<IFormRenderStore>),
  replace?: boolean | undefined
) => void;

type StateKeys<T> = {
  [K in keyof T]-?: T[K] extends (...args: unknown[]) => void ? never : K;
}[keyof T];

const initialState: Pick<IFormRenderStore, StateKeys<IFormRenderStore>> = {
  formsCount: 0,
  formIframeRef: { current: null },
  formConfig: null,
  showModalForms: false
};

const setFormConfig =
  (set: StoreSetter) =>
  (formConfig: IFormsConfiguration | null): void => {
    const drafts = (getItem(StorageKey.Drafts) as IDraft[]) ?? [];
    if (formConfig) {
      formConfig.Config.SessionInfo = [{ start: `${Date.now()}`, end: undefined, action: 'load' }];
      formConfig.Config.availableDraftIds = drafts?.map((form) => form.id);
    }
    set((state: IFormRenderStore) => ({
      formsCount: state.formsCount + 1,
      formConfig,
      showModalForms: !!formConfig?.Config
    }));
  };

const setShowModalForms =
  (set: StoreSetter) =>
  (showModalForms: boolean): void => {
    set(() => ({
      showModalForms
    }));
  };

const resetFormsCount = (set: StoreSetter) => (): void => {
  set(() => ({ formsCount: 0 }));
};

const setFormsRef =
  (set: StoreSetter) =>
  (ref: React.MutableRefObject<HTMLIFrameElement | null>): void => {
    set(() => ({ formIframeRef: ref }));
  };

const useFormRenderer = create<IFormRenderStore>((set) => ({
  ...initialState,
  setFormConfig: setFormConfig(set),
  setShowModalForms: setShowModalForms(set),
  resetFormsCount: resetFormsCount(set),
  setFormsRef: setFormsRef(set)
}));

export { useFormRenderer };
