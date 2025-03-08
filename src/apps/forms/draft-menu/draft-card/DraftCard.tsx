import Icon from '@lsq/nextgen-preact/icon';
import IconButton from 'common/component-lib/icon-button';
import { Variant } from 'common/types';
import { IDraftCardProps, IDraft } from '../draft-config';
import { openLeadDetailTab, openOpportunityDetailsTab } from 'common/utils/helpers';
import styles from '../drafts-menu.module.css';
import DraftCardContent from '../draft-card-content';
import { useState, lazy } from 'react';
import useToggle from 'common/utils/use-toggle/useToggle';
import { StorageKey } from 'common/utils/storage-manager';
import { useSyncLocalStorage } from 'common/utils/use-sync-local-storage/use-sync-local-storage';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { useNotification } from '@lsq/nextgen-preact/notification';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { useFormRenderer } from '../../form-renderer/new-form-renderer-store';

const RadioButton = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/radio')));
const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

const DraftCard = (props: IDraftCardProps): JSX.Element => {
  const { variant, draft, selectedDraft, onSelect } = props;
  const [selectedDraftForDeletion, setSelectedDraftForDeletion] = useState<IDraft | null>(null);
  const [showDeleteConfirmationModal, toggleDeleteConfirmationModal] = useToggle();
  const [drafts] = useSyncLocalStorage<IDraft[]>(StorageKey.Drafts, []);
  const { showAlert } = useNotification();

  const onEntityClick = (): void => {
    if (draft.opportunityId && draft?.opportunityCode) {
      openOpportunityDetailsTab({
        entityId: draft.opportunityId,
        eventCode: draft?.opportunityCode
      });
    } else if (draft.leadId) {
      openLeadDetailTab(draft.leadId);
    }
  };

  const onDeleteClose = (): void => {
    toggleDeleteConfirmationModal();
    setSelectedDraftForDeletion(null);
  };

  return (
    <>
      {showDeleteConfirmationModal && selectedDraftForDeletion ? (
        <ConfirmationModal
          show={showDeleteConfirmationModal}
          onClose={onDeleteClose}
          title="Delete Draft"
          description={`Are you sure you want to delete ${selectedDraftForDeletion?.formName}? This action will clear saved form data.`}
          buttonConfig={[
            {
              id: 1,
              name: 'Cancel',
              variant: Variant.Primary,
              onClick: onDeleteClose
            },
            {
              id: 2,
              name: 'Yes, Delete',
              variant: Variant.Error,
              onClick: (): void => {
                if (onSelect) {
                  onSelect(selectedDraftForDeletion);
                }
                onDeleteClose();
                showAlert({
                  type: Type.SUCCESS,
                  message: `${selectedDraftForDeletion?.formName} deleted successfully`
                });
              }
            }
          ]}
        />
      ) : null}
      <div key={draft.id} className={styles.draft_body_card}>
        {variant === 'radio' ? (
          <RadioButton
            radioGroup="draft-card"
            checked={selectedDraft?.id === draft.id}
            value={draft.id}
            onChange={() => {
              if (onSelect) onSelect(draft);
            }}>
            <div className={styles.draft_body_card_radio_wrapper}>
              <DraftCardContent draft={draft} />
            </div>
          </RadioButton>
        ) : (
          <DraftCardContent
            draft={draft}
            onClick={() => {
              const config = {
                draftId: draft.id,
                availableDraftIds: drafts?.map((draftItems: IDraft) => draftItems.id)
              };
              useFormRenderer.getState().setFormConfig({
                Config: config,
                OnShowFormChange: (showForm) => {
                  if (!showForm) {
                    useFormRenderer.getState().setFormConfig(null);
                  }
                }
              });
            }}
            onEntityClick={onEntityClick}>
            <IconButton
              customStyleClass={styles.draft_body_card_delete}
              onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
                e.stopPropagation();
                setSelectedDraftForDeletion(draft);
                toggleDeleteConfirmationModal();
              }}
              icon={<Icon name="delete" />}
            />
          </DraftCardContent>
        )}
      </div>
    </>
  );
};
DraftCard.defaultProps = {
  variant: 'delete',
  setSelectedDraft: (): void => {}
};

export default DraftCard;
