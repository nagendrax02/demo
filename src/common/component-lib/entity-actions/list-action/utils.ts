import { IRecordType } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { IGetMessage, IHandleBulkOperation, IHandleSuccess, IResults } from './list-action.types';
import { Type, INotification } from '@lsq/nextgen-preact/notification/notification.types';
import { EXCEPTION_MESSAGE } from 'common/constants';
import { ACTION_MESSAGE, FAILURE_MESSAGE } from './constant';
import { setActionSummary } from 'apps/smart-views/components/custom-tabs/manage-lists/manage-lists.store';

const getRecordDictionary = (
  records: IRecordType[],
  entityIds: string[]
): Record<string, IRecordType> => {
  const resObj = records
    ?.filter((item) => entityIds.includes(item.id))
    ?.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  return resObj || {};
};

export const handleSuccess = (props: IHandleSuccess): void => {
  const { setNotification, actionType, listCount, listName, failure, message } = props;

  const notificationMessage =
    message ||
    ACTION_MESSAGE[actionType]
      .replace('{recordName}', `'${listName}'`)
      .replace('{list}', listCount > 1 ? 'lists' : 'list');

  setNotification({
    type: failure ? Type.ERROR : Type.SUCCESS,
    message: notificationMessage
  });
};

const getBulkActionMessage = (props: IGetMessage): string => {
  const { results, entityIds, failureCount, dictionary } = props;

  return failureCount
    ? entityIds?.length > 1 && failureCount > 1
      ? FAILURE_MESSAGE
      : `List ${dictionary[entityIds?.[0]]?.Name} is engaged with some ${
          (results?.[0]?.status === 'fulfilled' && results?.[0]?.value?.[0]?.EntityEngagedName) ||
          ''
        }. Hence it cannot be Deleted`
    : '';
};

export const getRowActionMessage = (
  isFailure: boolean,
  records: IRecordType[],
  results: IResults[]
): string => {
  if (isFailure)
    return `List "${records?.[0]?.Name}" is engaged with some "${results?.[0]?.value?.[0]?.EntityEngagedName}". Hence it cannot be Deleted`;
  return '';
};

const processFailure = (setNotification: (notification: INotification) => void): void => {
  setNotification({
    type: Type.ERROR,
    message: EXCEPTION_MESSAGE
  });
};

export const fetchSuccessFailureStatistics = (
  results: IResults[],
  dictionary: Record<string, IRecordType>
): {
  success: number;
  failureCount: number;
  failedList: string[];
  nonEntityEngages: number;
} => {
  let success = 0;
  let failureCount = 0;
  const failedList: string[] = [];
  let nonEntityEngages = 0;

  results?.forEach((result) => {
    if (result?.status === 'fulfilled') {
      if (result?.value?.[0]?.IsSuccessful) {
        success++;
      } else {
        failureCount++;
        if (result?.value?.[0]?.EntityEngagedName) {
          failedList.push(
            `${dictionary[result?.value?.[0]?.ListId]?.Name} - ${result?.value?.[0]
              ?.EntityEngagedName}`
          );
        } else {
          nonEntityEngages++;
        }
      }
    } else {
      nonEntityEngages++;
    }
  });
  return {
    success,
    failureCount,
    failedList,
    nonEntityEngages
  };
};

const handleActionFailure = ({
  results,
  dictionary,
  success,
  failureCount,
  actionType
}: {
  results: IResults[];
  dictionary: Record<string, IRecordType>;
  success: number;
  failureCount: number;
  actionType: string;
}): void => {
  const failureMap: string[] = [];

  results?.map((item) => {
    if (!item?.value?.[0]?.IsSuccessful) {
      failureMap.push(
        `${dictionary?.[item?.value?.[0]?.ListId]?.Name} - ${item?.value?.[0]?.EntityEngagedName}`
      );
    }
  });

  setActionSummary({
    isFailure: true,
    successCount: success,
    failureCount: failureCount,
    failureList: failureMap,
    actionType: actionType
  });
};

export const handleBulkOperation = (props: IHandleBulkOperation): void => {
  const { results, records, entityIds, setNotification, handleClose, actionType, onSuccess } =
    props;

  const dictionary = getRecordDictionary(records, entityIds);

  const { success, failureCount, nonEntityEngages } = fetchSuccessFailureStatistics(
    results,
    dictionary
  );

  if (nonEntityEngages === entityIds?.length) {
    processFailure(setNotification);
    return;
  }

  if (
    entityIds?.length === 1 ||
    success === entityIds?.length ||
    failureCount === entityIds?.length
  ) {
    handleSuccess({
      setNotification,
      actionType,
      listCount: entityIds?.length,
      listName: `${entityIds?.length}`,
      failure: failureCount > 0,
      message: getBulkActionMessage({ results, entityIds, failureCount, dictionary })
    });
    onSuccess();
    handleClose();
  } else if (failureCount < entityIds?.length && success < entityIds?.length) {
    handleActionFailure({ results, dictionary, success, failureCount, actionType });
    handleClose();
  } else {
    handleClose();
  }
};
