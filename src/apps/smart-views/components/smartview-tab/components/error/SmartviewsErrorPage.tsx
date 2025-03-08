import { ErrorPageTypes } from 'common/component-lib/error-page/error-page.types';
import {
  EmptyRecords,
  NoMatchingRecords,
  TeamNotified,
  UnexpectedError
} from 'common/component-lib/error-page';
import { resetFilters } from '../../smartview-tab.store';
import { HeaderActions } from '../header';
import styles from '../../smartviews-tab.module.css';

interface ISmartviewsErrorPage {
  tabId: string;
  type: ErrorPageTypes;
  setError: React.Dispatch<React.SetStateAction<ErrorPageTypes | undefined>>;
  handleRefresh: () => Promise<void> | void;
}

const SmartviewsErrorPage = ({
  type,
  tabId,
  handleRefresh,
  setError
}: ISmartviewsErrorPage): JSX.Element => {
  const handleClearFilters = (): void => {
    setError(undefined);
    resetFilters(tabId);
  };

  const handleRefreshAction = (): Promise<void> | void => {
    setError(undefined);
    handleRefresh();
  };

  const errorTypeMap: Record<string, () => JSX.Element> = {
    noMatchingRecords: () => (
      <NoMatchingRecords variant="empty" handleClearFilters={handleClearFilters} />
    ),
    emptyRecords: () => (
      <EmptyRecords
        variant="empty"
        actions={
          <HeaderActions
            tabId={tabId}
            setErrorPage={setError}
            customStyles={styles.empty_records_action_wrapper}
          />
        }
      />
    ),
    teamNotified: () => <TeamNotified variant="empty" />,
    unexpectedError: () => <UnexpectedError variant="empty" handleRefresh={handleRefreshAction} />
  };

  return errorTypeMap[type]();
};

export default SmartviewsErrorPage;
