import { useEffect } from 'react';
import { trackError } from 'common/utils/experience';
import { CallerSource, httpGet, Module } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { CONSTANTS } from './utils';
import SuccessModal from '../success-modal';
import { getListId } from 'common/utils/helpers/helpers';
import RequestHistorySubDescription from '../success-modal/RequestHistory';

const RefreshList = ({
  setIsCustomRefreshTriggered,
  listName
}: {
  setIsCustomRefreshTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  listName: string;
}): JSX.Element => {
  const handleSuccess = async (): Promise<void> => {
    try {
      const listId = getListId();
      await httpGet({
        path: `${API_ROUTES.smartviews.listRefreshMemberCount}?listId=${listId}`,
        module: Module.Marvin,
        callerSource: CallerSource.ListDetailsRefreshList
      });
    } catch (error) {
      trackError(error);
    }
  };

  useEffect(() => {
    handleSuccess();
  }, []);

  const handleClose = (): void => {
    setIsCustomRefreshTriggered(false);
  };

  return (
    <div>
      <SuccessModal
        handleClose={handleClose}
        title={CONSTANTS.REFRESH_LIST_REQUEST}
        message={CONSTANTS.SUCCESS_MESSAGE.replace('{listName}', listName)}
        description={CONSTANTS.SUCCESS_DESCRIPTION}
        subDescription={<RequestHistorySubDescription />}
      />
    </div>
  );
};

export default RefreshList;
