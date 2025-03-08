import {
  IActionMenuItem,
  IEntityDetailsCoreData
} from 'apps/entity-details/types/entity-data.types';
import Action from './Action';
import { getCustomConfig, getUpdatedAdditionalData } from '../utils/utils';
import { lazy, useRef, useState } from 'react';
import { RecordType, useTabRecordCounter } from 'common/component-lib/tab-record-counter';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { ACTION } from 'apps/entity-details/constants';
import { skipAutoRefresh } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { workAreaIds } from 'common/utils/process';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

const ActionMenu = withSuspense(lazy(() => import('@lsq/nextgen-preact/action-menu')));
const ActionMenuV2 = withSuspense(lazy(() => import('@lsq/nextgen-preact/v2/action-menu')));

interface IMoreActionMenu {
  actions: IActionMenuItem[];
  coreData: IEntityDetailsCoreData;
  setActionClicked: React.Dispatch<React.SetStateAction<IActionMenuItem | null>>;
  setIsMenuOpen?: (show: boolean) => void;
  renderAsV2Component?: boolean;
  menuDimension?: Record<string, number>;
  customButton?: () => JSX.Element;
  customClass?: string;
  customConfig?: Record<string, string>;
  onSuccess?: () => void;
}

const MoreActionMenu = (props: IMoreActionMenu): JSX.Element => {
  const {
    renderAsV2Component,
    setIsMenuOpen,
    actions,
    menuDimension,
    coreData,
    customButton,
    customClass,
    customConfig,
    setActionClicked,
    onSuccess
  } = props;
  const { entityIds, entityDetailsType } = coreData;
  const primaryEntityId = entityIds?.[entityDetailsType || 'lead'];
  const isFormSubmissionSuccessful = useRef(false);
  const { updateTabRecordCount } = useTabRecordCounter();
  const [open, setOpen] = useState(false);

  const onFormSuccess = (actionId: string): void => {
    isFormSubmissionSuccessful.current = true;
    updateLeadAndLeadTabs();
    if (actionId === ACTION.Tasks) updateTabRecordCount(coreData?.entityIds?.lead, RecordType.Task);
  };

  const onFormClose = (showForm: boolean): void => {
    skipAutoRefresh(showForm);
    if (!showForm) {
      useFormRenderer.getState().setFormConfig(null);

      if (isFormSubmissionSuccessful.current) {
        isFormSubmissionSuccessful.current = false;
        onSuccess?.();
      }
    }
  };

  const handleMenuItemSelect = async (data: IActionMenuItem): Promise<void> => {
    const additionalData = getUpdatedAdditionalData(data?.workAreaConfig);
    const processFormConfig = (
      await import('apps/forms/forms-process-integration')
    ).getProcessFormConfigBasedOnProcessId({
      workAreaId: data?.workAreaConfig?.workAreaId ?? workAreaIds.NA,
      processId: data?.value ?? '',
      additionalData: additionalData,
      customConfig: getCustomConfig(customConfig || {}, data?.workAreaConfig),
      formId: data?.formId,
      onSuccess: () => {
        onFormSuccess(data?.id);
        onSuccess?.();
      },
      onShowFormChange: (showForm) => {
        onFormClose(showForm);
      },
      coreData
    });
    if (processFormConfig) {
      useFormRenderer.getState().setFormConfig(processFormConfig);
    } else {
      const processActionClickHandler = await import(
        'apps/entity-details/components/vcard/actions/button-actions/button-action-handler'
      );
      const formConfig = await processActionClickHandler.getFormConfig({
        action: data,
        entityId: primaryEntityId,
        customConfig,
        coreData,
        onSuccess: () => {
          onFormSuccess(data?.id);
          onSuccess?.();
        },
        onShowFormChange: (showForm) => {
          onFormClose(showForm);
        }
      });
      useFormRenderer.getState().setFormConfig(formConfig);
    }
    setActionClicked(data);
  };

  return renderAsV2Component ? (
    <ActionMenuV2
      open={open}
      onOpenChange={setOpen}
      actions={actions}
      onSelection={handleMenuItemSelect}>
      {customButton ? (
        customButton()
      ) : (
        <Action customClass={customClass} renderAsV2Component={renderAsV2Component} />
      )}
    </ActionMenuV2>
  ) : (
    <ActionMenu
      setIsMenuOpen={setIsMenuOpen}
      actions={actions}
      menuDimension={menuDimension}
      menuKey={'entityMoreActions' + (primaryEntityId ?? '')}
      onSelect={handleMenuItemSelect}>
      {customButton ? customButton() : <Action customClass={customClass} />}
    </ActionMenu>
  );
};

export default MoreActionMenu;

MoreActionMenu.defaultProps = {
  menuDimension: undefined,
  customClass: '',
  customConfig: {},
  onSuccess: (): void => {},
  customButton: undefined,
  setIsMenuOpen: undefined,
  renderAsV2Component: false
};
