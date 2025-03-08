import withSuspense from '@lsq/nextgen-preact/suspense';
import { trackError } from 'common/utils/experience/utils/track-error';
import { Variant } from 'common/types';
import { useEffect, useState, lazy } from 'react';
import styles from './Delete.module.css';
import { IDeleteActionHandler } from '../../types/action-handler.types';
import { IButtonConfig } from '@lsq/nextgen-preact/modal/confirmation-modal/confirmation-modal.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { IEntityRepresentationName } from '../../types/entity-data.types';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

export interface IDelete {
  handleClose: () => void;
  customConfig?: Record<string, string>;
  actionHandler: IDeleteActionHandler;
  onSuccess?: () => void;
  isBulkAction?: boolean;
  repName?: IEntityRepresentationName;
}

const Delete = (props: IDelete): JSX.Element => {
  const { handleClose, actionHandler, customConfig, isBulkAction, repName } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState<string>('');
  const [deleteDisabled, setDeleteDisabled] = useState(false);

  useEffect(() => {
    (async function (): Promise<void> {
      const resp = await actionHandler?.getDescription(customConfig, isBulkAction);
      setDescription(resp);
      if (actionHandler?.idDeleteDisabled)
        setDeleteDisabled(await actionHandler?.idDeleteDisabled());
      setIsLoading(false);
    })();
  }, [actionHandler]);

  const handleDelete = async (): Promise<void> => {
    try {
      await actionHandler?.handleDelete(customConfig, repName, isBulkAction);
    } catch (error) {
      trackError(error);
    }
    handleClose();
  };

  const getButtonConfig = (): IButtonConfig[] => {
    if (deleteDisabled) {
      return [
        {
          id: 1,
          name: 'Ok',
          variant: Variant.Primary,
          onClick: (): void => {
            handleClose();
          }
        }
      ];
    }
    return [
      {
        id: 1,
        name: 'No',
        variant: Variant.Primary,
        onClick: (): void => {
          handleClose();
        },
        isDisabled: isLoading
      },
      {
        id: 2,
        name: actionHandler?.customeText ?? 'Yes, Delete',
        variant: actionHandler?.variant ?? Variant.Secondary,
        onClick: handleDelete,
        showSpinnerOnClick: true,
        customStyleClass: styles.delete_button,
        isDisabled: isLoading
      }
    ];
  };

  return (
    <>
      <ConfirmationModal
        onClose={handleClose}
        show
        title={actionHandler
          ?.getTitle()
          ?.replace('{{repSingular}}', repName?.SingularName ?? 'Lead')}
        description={
          isLoading ? (
            <Shimmer width="100%" height="32px" />
          ) : (
            description?.replace('{{repPluralName}}', repName?.PluralName ?? 'Leads')
          )
        }
        customStyleClass={styles.custom_body}
        buttonConfig={getButtonConfig()}
      />
    </>
  );
};

Delete.defaultProps = {
  onSuccess: (): void => {},
  customConfig: {}
};

export default Delete;
