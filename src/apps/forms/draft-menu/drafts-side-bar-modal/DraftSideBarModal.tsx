import React, { useCallback, lazy } from 'react';
import DraftCard from '../draft-card';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import SideModal from '@lsq/nextgen-preact/side-modal';
import { IDraft, MAX_FORMS_DRAFT_LIMIT } from '../draft-config';
import { Variant } from 'common/types';
import { useDraftsStore } from '../drafts.store';
import DraftsEmptyState from '../drafts-empty-state';
import styles from '../drafts-menu.module.css';
import { useSyncLocalStorage } from 'common/utils/use-sync-local-storage/use-sync-local-storage';
import { StorageKey } from 'common/utils/storage-manager';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

interface IDraftSideBarModalProps {
  showDraftMenu: boolean;
  toggleDraftMenu: React.DispatchWithoutAction;
}

const DraftSideBarModal = (props: IDraftSideBarModalProps): JSX.Element => {
  const { showDraftMenu, toggleDraftMenu } = props;
  const { selectedDraft } = useDraftsStore();
  const [drafts, setDrafts] = useSyncLocalStorage<IDraft[]>(StorageKey.Drafts, []);

  const removeDraft = useCallback(
    (draft: IDraft): void => {
      const newDrafts = drafts.filter((d: IDraft) => d.id !== draft.id);
      setDrafts(newDrafts);
    },
    [drafts, setDrafts]
  );

  return (
    <SideModal
      show={showDraftMenu}
      setShow={toggleDraftMenu}
      customStyleClass={styles.draft_menu}
      containerStyleClass={styles.draft_menu_container}>
      <SideModal.Header title="Drafts" subTitle="Logging out deletes all drafts saved here." />
      <SideModal.Body customStyleClass={styles.draft_body}>
        <DraftsEmptyState drafts={drafts}>
          <div>
            <div className={styles.draft_body_header}>
              <div className={styles.draft_body_header_text}>
                <span>Saved: </span>
                <span className={styles.draft_body_header_text_highlight}>
                  {drafts?.length} of
                  <span className={styles.draft_body_header_text_bold}>
                    {MAX_FORMS_DRAFT_LIMIT}
                  </span>
                </span>
              </div>
              {drafts?.length === MAX_FORMS_DRAFT_LIMIT ? (
                <div className={styles.draft_body_header_badge}>
                  <Icon
                    customStyleClass={styles.draft_body_header_badge_icon}
                    name="error"
                    variant={IconVariant.Outlined}
                  />
                  <span className={styles.draft_body_header_badge_text}>Max limit reached</span>
                </div>
              ) : null}
            </div>
            <div className={styles.draft_body_card_list}>
              {drafts.map((draft: IDraft) => (
                <DraftCard
                  variant="delete"
                  key={draft.id}
                  draft={draft}
                  selectedDraft={selectedDraft}
                  onSelect={removeDraft}
                />
              ))}
            </div>
          </div>
        </DraftsEmptyState>
      </SideModal.Body>
      <SideModal.Footer customStyleClass={styles.draft_footer}>
        <Button text="Close" onClick={toggleDraftMenu} variant={Variant.Secondary} />
      </SideModal.Footer>
    </SideModal>
  );
};

export default DraftSideBarModal;
