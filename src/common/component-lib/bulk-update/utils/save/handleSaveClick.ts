import { getSelectedFieldValue } from '../../bulk-update.store';
import { SAVE_MAPPER } from './constant';

export const handleSaveClick = async (
  onSuccess: (triggerReload?: boolean) => void
): Promise<void> => {
  const { initGridConfig } = getSelectedFieldValue();

  await SAVE_MAPPER[initGridConfig?.entityType]?.onSave(onSuccess);
};
