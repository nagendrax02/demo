import { create } from 'zustand';
import { FORMS_MESSAGE_EVENT_TYPES, IDraft } from './draft-config';
import { getFormsRenderUrl, sendPostMessage } from 'apps/forms/utils';
import { useFormRenderer } from '../form-renderer/new-form-renderer-store';

interface IDraftsStore {
  selectedDraft: IDraft | null;
  showTooltip: boolean;
  showReplaceDraftModal: boolean;
  setTooltip: (value: boolean) => void;
  setSelectedDraft: (draft: IDraft | null) => void;
  replaceDraft: (isCancelled: boolean) => void;
  setShowReplaceDraftModal: (
    value: boolean,
    ref?: React.MutableRefObject<HTMLIFrameElement | null>
  ) => void;
  setShowTooltip: (value: boolean) => void;
}

type StateKeys<T> = {
  [K in keyof T]-?: T[K] extends (...args: unknown[]) => void ? never : K;
}[keyof T];

const initialState: Pick<IDraftsStore, StateKeys<IDraftsStore>> = {
  selectedDraft: null,
  showReplaceDraftModal: false,
  showTooltip: false
};

type StoreSetter = (
  partial:
    | IDraftsStore
    | Partial<IDraftsStore>
    | ((state: IDraftsStore) => IDraftsStore | Partial<IDraftsStore>),
  replace?: boolean | undefined
) => void;

const setTooltip =
  (set: StoreSetter) =>
  (value: boolean): void => {
    set(() => ({ showTooltip: value }));
  };

const setSelectedDraft =
  (set: StoreSetter) =>
  (draft: IDraft | null): void => {
    set(() => ({ selectedDraft: draft }));
  };

const replaceDraft =
  (set: StoreSetter) =>
  (isCancelled: boolean): void => {
    set((state: IDraftsStore) => {
      const formIframeRef = useFormRenderer.getState().formIframeRef;
      if (formIframeRef.current) {
        const message = {
          type: FORMS_MESSAGE_EVENT_TYPES.SELECTED_REPLACE_DRAFT,
          id: !isCancelled ? state.selectedDraft?.id : undefined
        };

        const formsRenderUrl = getFormsRenderUrl();

        sendPostMessage(formIframeRef.current, message, Object.values([formsRenderUrl]));
        return { showReplaceDraftModal: false };
      }
      return state;
    });
  };

const setShowReplaceDraftModal =
  (set: StoreSetter) =>
  (value: boolean, ref?: React.MutableRefObject<HTMLIFrameElement | null>): void => {
    set(() => ({ showReplaceDraftModal: value, formIframeRef: value ? ref : { current: null } }));
  };

const setShowTooltip =
  (set: StoreSetter) =>
  (value: boolean): void => {
    set(() => ({ showTooltip: value }));
  };

export const useDraftsStore = create<IDraftsStore>((set) => ({
  ...initialState,
  setTooltip: setTooltip(set),
  setSelectedDraft: setSelectedDraft(set),
  replaceDraft: replaceDraft(set),
  setShowReplaceDraftModal: setShowReplaceDraftModal(set),
  setShowTooltip: setShowTooltip(set)
}));
