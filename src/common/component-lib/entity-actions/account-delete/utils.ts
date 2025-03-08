import { trackError } from 'common/utils/experience/utils/track-error';
import { Variant } from 'common/types';
import { IButtonConfig } from '@lsq/nextgen-preact/modal/confirmation-modal/confirmation-modal.types';
import { CallerSource, httpPost, Module } from 'common/utils/rest-client';
import { API_ROUTES, EXCEPTION_MESSAGE } from 'common/constants';
import { IAccountDeleteResponse, ISearchParams } from './delete.type';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import styles from './style.module.css';

export const getRepName = (repName: IEntityRepresentationName, length?: number): string => {
  return (length || 0) > 1 ? repName?.PluralName : repName?.SingularName;
};
export const hasAssociatedLeads = async (entityIds?: string[]): Promise<boolean> => {
  try {
    if ((entityIds?.length || 0) > 1) return false;
    const payload = {
      CompanyId: entityIds?.[0],
      Columns: {
        ['Include_CSV']: 'ProspectID'
      },
      QuickSearch: '',
      Sorting: {
        ColumnName: 'FirstName',
        Direction: 0
      },
      Paging: {
        PageIndex: 1,
        PageSize: 25
      },
      DoNotFetchStarredLeads: true,
      DoNotFetchTaggedLeads: true
    };
    const response: Record<string, unknown>[] = await httpPost({
      path: API_ROUTES.accountLeads,
      module: Module.Marvin,
      body: payload,
      callerSource: CallerSource.AccountLeads
    });

    return !!response?.length;
  } catch (err) {
    trackError(err);
  }
  return false;
};

const getFetchCriteria = (searchParams?: ISearchParams): Record<string, unknown> => {
  return {
    QuickSearch: '',
    Stage: 'All',
    OwnerUserId: 'Any',
    AdvancedSearch: searchParams?.advancedSearchText,
    DatePickerField: '',
    DatePickerFrom: '',
    DatePickerTo: ''
  };
};
// eslint-disable-next-line max-lines-per-function
export const handleDelete = async (
  onSuccess: (IsAsyncRequest: boolean) => void,
  setIsDeleting: (data: boolean) => void,
  config: {
    repName: IEntityRepresentationName;
    entityIds: string[];
    companyTypeId: string;
    canDeleteAll: boolean;
    searchParams?: ISearchParams;
  }
): Promise<void> => {
  setIsDeleting(true);
  const { entityIds, companyTypeId, repName, searchParams, canDeleteAll } = config;
  try {
    const response: IAccountDeleteResponse = await httpPost({
      path: API_ROUTES.AccountBulkDelete,
      module: Module.Marvin,
      body: {
        CompanyIds: entityIds,
        CompanyTypeId: companyTypeId,
        WithLeadDelete: false,
        FetchCriteria: canDeleteAll ? getFetchCriteria(searchParams) : null
      },
      callerSource: CallerSource.AccountDetailsVCard
    });

    if (response?.IsAsyncRequest) {
      onSuccess(true);
    } else {
      showNotification({
        type: Type.SUCCESS,
        message: `${getRepName(repName, entityIds?.length)} deleted successfully.`
      });
      onSuccess(false);
    }
  } catch (err) {
    trackError(err);
    showNotification({
      type: Type.ERROR,
      message: `${err?.response?.ExceptionMessage || EXCEPTION_MESSAGE}`
    });
  }
  setIsDeleting(false);
};

const getOkButton = (handleClose: () => void, showAsyncRegMsg: boolean): IButtonConfig[] => {
  return [
    {
      id: 1,
      name: showAsyncRegMsg ? 'Close' : 'Ok',
      variant: Variant.Primary,
      onClick: (): void => {
        handleClose();
      }
    }
  ];
};
// eslint-disable-next-line max-lines-per-function
export const getButtonConfig = ({
  handleClose,
  isDeleteDisabled,
  isLoading,
  showAsyncRegMsg,
  isDeleting,
  onDelete
}: {
  handleClose: () => void;
  onDelete: () => Promise<void>;
  isLoading: boolean;
  isDeleteDisabled: boolean;
  showAsyncRegMsg: boolean;
  isDeleting: boolean;
}): IButtonConfig[] => {
  if (isDeleteDisabled || showAsyncRegMsg) {
    return getOkButton(handleClose, showAsyncRegMsg);
  }
  return [
    {
      id: 1,
      name: 'No',
      variant: Variant.Primary,
      onClick: (): void => {
        handleClose();
      },
      isDisabled: isLoading || isDeleting
    },
    {
      id: 2,
      name: 'Yes, Delete',
      variant: Variant.Secondary,
      onClick: onDelete,
      isLoading: isDeleting,
      customStyleClass: styles.delete_button,
      isDisabled: isLoading || isDeleting
    }
  ];
};
