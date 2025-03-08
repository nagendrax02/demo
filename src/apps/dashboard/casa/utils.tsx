import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ICasaHelperUtils, IGetIsRestrictedData } from './casa.types';
import { isRestricted } from 'common/utils/permission-manager';
import { CallerSource } from 'common/utils/rest-client';
import { IFormConfig } from '../../forms/forms.types';
import { trackError } from 'common/utils/experience';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

const useCasaHelperUtils = (): ICasaHelperUtils => {
  const { showAlert } = useNotification();
  const showNotification = (type: Type, message: string): void => {
    showAlert({
      type: type,
      message: message
    });
  };

  const getIsRestricted = async ({
    permissionEntityType,
    actionType,
    entityId
  }: IGetIsRestrictedData): Promise<boolean> => {
    return isRestricted({
      entity: permissionEntityType,
      action: actionType,
      entityId: entityId,
      callerSource: CallerSource.Dashboard
    });
  };

  const showForms = (formsConfig: IFormConfig): void => {
    useFormRenderer.getState().setFormConfig({ Config: formsConfig });
  };

  const handleLogOut = async (): Promise<void> => {
    try {
      const module = await import('common/utils/authentication/utils/logout');
      module.logout();
    } catch (ex) {
      trackError(ex);
    }
  };

  return {
    showNotification,
    getIsRestricted,
    showForms,
    handleLogOut
  };
};

export default useCasaHelperUtils;
