import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { Variant } from 'src/common/types';
import { IButtonConfig } from '@lsq/nextgen-preact/modal/confirmation-modal/confirmation-modal.types';
import styles from './style.module.css';

export const getRepName = (repName: IEntityRepresentationName, length?: number): string => {
  return (length || 0) > 1 ? repName?.PluralName : repName?.SingularName;
};
const getOkButton = (handleClose: () => void, isAsyncReq: boolean): IButtonConfig[] => {
  return [
    {
      id: 1,
      name: isAsyncReq ? 'Close' : 'Ok',
      variant: Variant.Secondary,
      onClick: (): void => {
        handleClose();
      }
    }
  ];
};
// eslint-disable-next-line max-lines-per-function
export const getButtonConfig = ({
  handleClose,
  isAsyncReq,
  isDeleting,
  onDelete,
  partialMessage
}: {
  handleClose: () => void;
  onDelete: () => Promise<void>;

  isAsyncReq: boolean;
  isDeleting: boolean;
  partialMessage: { successCount: number; failureCount: number };
}): IButtonConfig[] => {
  if (isAsyncReq || partialMessage?.failureCount || partialMessage?.successCount) {
    return getOkButton(handleClose, isAsyncReq);
  }

  return [
    {
      id: 1,
      name: 'No',
      variant: Variant.Primary,
      onClick: (): void => {
        handleClose();
      },
      isDisabled: isDeleting
    },
    {
      id: 2,
      name: 'Yes, Delete',
      variant: Variant.Secondary,
      onClick: onDelete,
      isLoading: isDeleting,
      customStyleClass: styles.delete_button,
      isDisabled: isDeleting
    }
  ];
};
