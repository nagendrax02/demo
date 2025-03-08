import DraftCard from '../draft-card';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '@lsq/nextgen-preact/v2/modal';
import { IDraft } from '../draft-config';
import { Variant } from 'common/types';
import { useDraftsStore } from '../drafts.store';
import styles from '../drafts-menu.module.css';
import DraftsEmptyState from '../drafts-empty-state';
import { useSyncLocalStorage } from 'common/utils/use-sync-local-storage/use-sync-local-storage';
import { StorageKey } from 'common/utils/storage-manager';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy, useCallback } from 'react';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const DraftReplaceModal = (): JSX.Element => {
  const {
    replaceDraft,
    selectedDraft,
    setSelectedDraft,
    setShowReplaceDraftModal,
    showReplaceDraftModal
  } = useDraftsStore();
  const [drafts] = useSyncLocalStorage<IDraft[]>(StorageKey.Drafts, []);

  const handleCancel = useCallback(() => {
    replaceDraft(true);
    setShowReplaceDraftModal(false);
  }, [replaceDraft, setShowReplaceDraftModal]);

  const handleClick = useCallback(() => {
    replaceDraft(false);
  }, [replaceDraft]);

  return (
    <Modal
      show={showReplaceDraftModal}
      containerCustomStyleClass={styles.draft_limit_reached_modal}
      customStyleClass={styles.draft_limit_reached_modal_content}>
      <ModalHeader
        customStyleClass={styles.draft_limit_reached_modal_header}
        title="Draft Limit Reached"
        onClose={(): void => {
          setShowReplaceDraftModal(false);
        }}
      />
      <ModalBody>
        <div>
          <p className={styles.draft_body_description}>
            To save the new draft, choose an old draft to replace. The old draft will be deleted.
          </p>
          <DraftsEmptyState drafts={drafts}>
            <div className={styles.draft_body_card_list}>
              {drafts.map((draft: IDraft) => (
                <DraftCard
                  variant="radio"
                  key={draft.id}
                  draft={draft}
                  selectedDraft={selectedDraft}
                  onSelect={setSelectedDraft}
                />
              ))}
            </div>
          </DraftsEmptyState>
        </div>
      </ModalBody>
      <ModalFooter customStyleClass={styles.draft_limit_reached_modal_footer}>
        <>
          <Button text="Cancel" onClick={handleCancel} variant={Variant.Secondary} />
          <Button
            text="Replace"
            onClick={handleClick}
            variant={Variant.Primary}
            disabled={!selectedDraft}
          />
        </>
      </ModalFooter>
    </Modal>
  );
};

export default DraftReplaceModal;
