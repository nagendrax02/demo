import { trackError } from 'common/utils/experience/utils/track-error';
import { IAccount } from 'common/types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { IDeleteActionHandler } from 'apps/entity-details/types/action-handler.types';
import { IAccountLeads } from 'common/types/entity/account/details.types';
import { getAccountId, getAccountTypeId, isMiP } from 'common/utils/helpers/helpers';
import { setLocation } from 'router/utils/helper';

export interface IAccountDeleteResponse {
  AffectedRows: number;
  CompanyName: string;
  AccountLeadCount: number;
  WithLeadDelete: boolean;
  IsAsyncRequest: boolean;
  LeadBulkActionResponse: null;
  LeadSyncActionResponse: null;
}
const getDeleteTitle = (accRepName: string): string => {
  return `Delete ${accRepName}`;
};

const hasAssociatedLeads = async (): Promise<boolean> => {
  const payload = {
    CompanyId: getAccountId(),
    Columns: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Include_CSV: 'ProspectID'
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
  try {
    const response = (await httpPost({
      path: API_ROUTES.accountLeads,
      module: Module.Marvin,
      body: payload,
      callerSource: CallerSource.AccountLeads
    })) as IAccountLeads[];
    if (response?.length) {
      return true;
    }
  } catch (err) {
    trackError(err);
  }
  return false;
};

const getDeleteDescription = async (entityData: IAccount, accRepName: string): Promise<string> => {
  const isLeadsAssociated = await hasAssociatedLeads();
  const description = isLeadsAssociated
    ? `Please delete all the associated leads with ${accRepName} to proceed further`
    : 'Are you sure you want to delete this account?. This action cannot be undone.';
  return description;
};

const handlePageRedirect = (): void => {
  if (isMiP()) {
    const path = window.location.pathname;
    const pathName = path?.substring?.(0, path?.lastIndexOf('/'));
    const redirectLocation = `${window.location.origin}${pathName}`;
    window.open(redirectLocation, '_self');
  } else {
    setLocation('/');
  }
};

const handleDelete = async (accRepName: string): Promise<void> => {
  try {
    const accId = getAccountId();
    const response: IAccountDeleteResponse = await httpPost({
      path: API_ROUTES.AccountBulkDelete,
      module: Module.Marvin,
      body: {
        CompanyIds: [accId],
        CompanyTypeId: getAccountTypeId(),
        WithLeadDelete: false,
        FetchCriteria: null
      },
      callerSource: CallerSource.AccountDetailsVCard
    });
    if (response && response?.IsAsyncRequest) {
      showNotification({
        type: Type.SUCCESS,
        message:
          'Your bulk update request has been queued. You will be notified when the process is complete.'
      });
    } else {
      showNotification({
        type: Type.SUCCESS,
        message: `${accRepName}(s) deleted successfully.`
      });
    }
    handlePageRedirect();
  } catch (err) {
    trackError(err);
    showNotification({
      type: Type.ERROR,
      message: `${err?.response?.ExceptionMessage || err?.message}`
    });
  }
};

export const deleteActionHandler = (entityData: IAccount): IDeleteActionHandler => {
  const accRepName = entityData?.metaData?.AccountRepresentationConfig?.SingularName;

  return {
    getTitle: () => getDeleteTitle(accRepName || 'Account'),
    getDescription: () => getDeleteDescription(entityData, accRepName || 'Account'),
    handleDelete: () => handleDelete(accRepName || 'Account'),
    idDeleteDisabled: () => hasAssociatedLeads()
  };
};
