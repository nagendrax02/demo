import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { Theme } from 'common/types';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { useDraftsStore } from './drafts.store';
import { useAsync } from 'common/utils/use-async/useAsync';
import { getSettingConfig, settingKeys } from 'common/utils/helpers';
import { CallerSource } from 'common/utils/rest-client';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import styles from './drafts-menu.module.css';
import ControlledTooltip from './controlled-tooltip';
import DraftReplaceModal from './drafts-replace-modal';
import DraftSideBarModal from './drafts-side-bar-modal';
import DraftSavedTooltip from './draft-saved-tooltip';
import { IDraft, MAX_FORMS_DRAFT_LIMIT } from './draft-config';
import useToggle from 'common/utils/use-toggle/useToggle';
import { StorageKey } from 'common/utils/storage-manager';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { useSyncLocalStorage } from 'common/utils/use-sync-local-storage/use-sync-local-storage';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface IDraftsMenuProps {
  customRenderer?: ({
    handleClick,
    draftCount
  }: {
    handleClick: () => void;
    draftCount: number;
  }) => JSX.Element;
}

const DraftsNotificationBadge = (props: { draftsCount: number }): JSX.Element | null => {
  const { draftsCount } = props;
  const showWarning = draftsCount === MAX_FORMS_DRAFT_LIMIT;

  if (!draftsCount) return null;

  if (showWarning)
    return (
      <Icon
        name="error"
        customStyleClass={styles.draft_notification_warning}
        variant={IconVariant.Outlined}
      />
    );

  return <span className={styles.drafts_count}>{draftsCount}</span>;
};

const DraftsMenu = ({ customRenderer }: IDraftsMenuProps): JSX.Element | null => {
  const { data, loading } = useAsync({
    asyncFunction: async () => {
      const response = await getSettingConfig(
        settingKeys.EnableDynamicFormsToSaveAsDrafts,
        CallerSource.MiPNavMenu
      );
      return response as string;
    }
  });
  const { setShowTooltip, showTooltip, showReplaceDraftModal } = useDraftsStore();
  const [drafts] = useSyncLocalStorage<IDraft[]>(StorageKey.Drafts, []);
  const [showDraftMenu, toggleDraftMenu] = useToggle();

  if (loading) return <Shimmer height="36px" width="36px" />;

  if (!data || data === '0') return null;

  return (
    <div>
      {showReplaceDraftModal ? <DraftReplaceModal /> : null}
      {showDraftMenu ? (
        <DraftSideBarModal showDraftMenu={showDraftMenu} toggleDraftMenu={toggleDraftMenu} />
      ) : null}
      <ControlledTooltip
        content={<DraftSavedTooltip draftsCount={drafts?.length} />}
        show={showTooltip}
        autoCloseInterval={3000}
        onClose={() => {
          setShowTooltip(false);
        }}>
        {customRenderer ? (
          customRenderer({ handleClick: toggleDraftMenu, draftCount: drafts?.length })
        ) : (
          <Tooltip
            content="Drafts"
            placement={Placement.Vertical}
            theme={Theme.Dark}
            trigger={[Trigger.Hover]}>
            <span className={styles.draft_icon_wrapper}>
              <Icon customStyleClass={styles.draft_icon} name="save" onClick={toggleDraftMenu} />
              <DraftsNotificationBadge draftsCount={drafts?.length} />
            </span>
          </Tooltip>
        )}
      </ControlledTooltip>
    </div>
  );
};

export default DraftsMenu;
