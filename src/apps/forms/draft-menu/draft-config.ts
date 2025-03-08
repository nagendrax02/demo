export const FORMS_MESSAGE_EVENT_TYPES = {
  SAVE_AS_DRAFT: 'Form_SavedDrafts',
  SAVE_AS_DRAFT_FORCED: 'Form_SavedDrafts_Forced',
  REPLACE_DRAFT: 'ShowReplaceDraftList',
  SELECTED_REPLACE_DRAFT: 'SelectedReplaceDraft',
  SWLIT_MODAL_CLOSE: 'swlite-modal-close',
  AUTOMATICALY_SAVE_FORM: 'auto-save-form'
} as const;

export const MAX_FORMS_DRAFT_LIMIT = 5;

export interface IDraft {
  id: string;
  createdOn: number;
  formName: string;
  displayName: string;
  opportunityId?: string;
  leadId?: string;
  opportunityCode?: string;
}

export interface IDraftCardContentProps {
  onClick?: () => void;
  onEntityClick?: () => void;
  draft: IDraft;
  children?: React.ReactNode;
}

export interface IDraftCardProps {
  variant: 'radio' | 'delete';
  draft: IDraft;
  selectedDraft: IDraft | null;
  onSelect?: (draft: IDraft) => void;
}
