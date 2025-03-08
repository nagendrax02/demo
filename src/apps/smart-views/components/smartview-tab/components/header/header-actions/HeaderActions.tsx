import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { workAreaIds } from 'common/utils/process';
import { IProcessFormsData, IProcessMenuItem } from 'common/utils/process/process.types';
import {
  getTabData,
  setUpdatedHeaderAction,
  useQuickFilter,
  useSmartViewHeaderAction,
  useTabEntityCode,
  useTabType
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import styles from './header-actions.module.css';
import {
  IHeaderAction,
  RestrictExportForEntity
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { HeaderActionType } from 'apps/smart-views/constants/constants';
import { lazy, useState, useEffect } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { CallerSource } from 'common/utils/rest-client';
import { HEADER_FORM_ACTION, HEADER_BUTTON_ACTION, NON_PROCESS_BUTTON } from './constant';
import {
  getConvertedAction,
  getFilteredProcessActions,
  handleToggleAction,
  getEntityCode,
  getUpdatedActionConfiguration,
  updateGridInEss
} from './utils';
import { refreshGrid } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import Icon from '@lsq/nextgen-preact/icon';
import {
  getExportRestrictionFromTenantSetting,
  getPermissionForExport
} from 'common/component-lib/entity-export/utils';
import { isCalendarViewActive } from 'apps/smart-views/components/smartview-tab/utils';
import {
  isEntityDetailTab,
  isSmartviewTab,
  isManageTab,
  logSVModuleUsage
} from 'apps/smart-views/utils/utils';

import { configureNonSmartviewAndDetailsTabs } from 'apps/smart-views/components/custom-tabs/manage-lead-tab/augment';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';
import HeaderActionWrapper from './HeaderActionWrapper';
import { classNames } from 'common/utils/helpers/helpers';
import { ActivityCodes } from 'apps/smart-views/augment-tab-data/activity/constants';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';
import { ErrorPageTypes } from 'common/component-lib/error-page/error-page.types';
import { TaskActionIds } from 'apps/smart-views/augment-tab-data/task/constants';

const HeaderActionsRenderer = withSuspense(lazy(() => import('./HeaderActionsRenderer')));
const Button = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/v2/button').then((module) => ({ default: module.Button })))
);

export interface IHeaderActions {
  tabId: string;
  customStyles?: string;
  setErrorPage: React.Dispatch<React.SetStateAction<ErrorPageTypes | undefined>>;
}

const HeaderActions = (props: IHeaderActions): JSX.Element => {
  const { tabId, customStyles, setErrorPage } = props;
  const tabData = getTabData(tabId);
  const tabType = useTabType();
  const currentActionConfiguration = useSmartViewHeaderAction(tabId);
  const tabEntityCode = useTabEntityCode(tabId);
  const [selectedHeaderAction, setSelectedHeaderAction] = useState<IMenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processFormsData, setProcessFormsData] = useState<IProcessFormsData | null>(null);
  const [actionConfiguration, setActionConfiguration] = useState(currentActionConfiguration);

  const quickFilter = useQuickFilter(tabId);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        // TODO: remove this conditional logic and add better way to determine when to remove restriction actions
        if (!isSmartviewTab(tabId) && !isEntityDetailTab(tabId) && !isManageTab(tabId)) {
          setActionConfiguration(currentActionConfiguration);
          return;
        }

        // TODO: below 'configureNonSmartviewAndDetailsTabs' function need to be refactored, it should be passed from tabData and then used.

        setActionConfiguration(
          await getUpdatedActionConfiguration(
            configureNonSmartviewAndDetailsTabs(
              currentActionConfiguration,
              quickFilter?.InternalName || '',
              tabId
            ),
            tabData?.headerConfig?.secondary
          )
        );
      } catch (error) {
        trackError(error);
      }
    })();
  }, [currentActionConfiguration, quickFilter?.Name]);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        setIsLoading(true);
        const fetchData = (await import('common/utils/process/process'))
          .fetchMultipleWorkAreaProcessForms;
        const processForms = await fetchData(
          getFilteredProcessActions(actionConfiguration),
          CallerSource.SmartViews
        );
        if (processForms) setProcessFormsData(processForms);
      } catch (error) {
        trackError(error);
      }
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCapitalizeTabType = (): string => {
    return tabType?.charAt(0)?.toUpperCase() + tabType.slice(1);
  };

  useEffect(() => {
    (async function getEntityConfig(): Promise<void> {
      const [isExportRestricted, settingInfo] = await Promise.all([
        getPermissionForExport(tabData?.type, tabData?.entityCode),
        getExportRestrictionFromTenantSetting()
      ]);

      if (isExportRestricted) {
        setUpdatedHeaderAction(tabId, RestrictExportForEntity.Disable);
      } else if (
        settingInfo?.RestrictExportForAllEntities ||
        settingInfo?.RestrictEntityExport?.includes(getCapitalizeTabType())
      ) {
        setUpdatedHeaderAction(tabId, RestrictExportForEntity.Remove);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalendarViewActive(tabData)]);

  const getCustomStyleClass = (action: IHeaderAction): string => {
    const customStyleClass: Record<string, string> = {
      [HeaderActionType.QuickAction]: classNames(styles.quick_action, 'ng_sh_b'),
      [HeaderActionType.MoreAction]: styles.more_action,
      [HeaderActionType.ToggleAction]: `${styles.toggle_action} ${
        action?.isActive ? styles.toggle_action_active : ''
      }`,
      [HeaderActionType.SecondaryAction]: classNames(
        action?.disabled ? '' : styles.secondary_action,
        'ng_sh_b'
      )
    };
    return customStyleClass[action?.actionType] || '';
  };

  const onSuccess = (data: IMenuItem): void => {
    if (data?.id == 'quick_add_lead' || data?.id == 'add_new_lead') {
      updateGridInEss();
    } else {
      refreshGrid(tabId);
    }
  };

  const handleMenuItemSelect = async (data: IProcessMenuItem): Promise<void> => {
    const getUpdatedAdditionalData = (
      await import('apps/entity-details/components/vcard/actions/utils/utils')
    ).getUpdatedAdditionalData;
    const additionalData = getUpdatedAdditionalData(data?.workAreaConfig);
    const processFormConfig = (
      await import('apps/forms/forms-process-integration')
    ).getProcessFormConfigBasedOnProcessId({
      workAreaId: data?.workAreaConfig?.workAreaId ?? workAreaIds.NA,
      processId: data?.value ?? '',
      additionalData: additionalData,
      formId: data?.formId,
      onSuccess: (response) => {
        if (data?.handleCustomSuccess) {
          data?.handleCustomSuccess?.(response);
        }
        onSuccess(data);
      },
      onShowFormChange: (showForm) => {
        if (!showForm) {
          useFormRenderer.getState().setFormConfig(null);
        }
      }
    });
    if (processFormConfig) {
      useFormRenderer.getState().setFormConfig(processFormConfig);
    } else {
      const processActionClickHandler = await import(
        'apps/entity-details/components/vcard/actions/button-actions/button-action-handler'
      );
      const formConfig = await processActionClickHandler.getFormConfig({
        action: {
          id: HEADER_FORM_ACTION[data.value],
          title: data.label,
          entityTypeId:
            tabEntityCode === ActivityCodes.CANCELLED_SALES_ACTIVITY
              ? ActivityCodes.SALES_ACTIVITY
              : tabEntityCode
        },
        customConfig: {
          EntityType: getEntityCode(tabEntityCode ?? ''),
          relatedEntityCode: tabData.relatedEntityCode ?? ''
        },
        onSuccess: (response) => {
          if (data?.handleCustomSuccess) {
            data?.handleCustomSuccess?.(response);
          }
          onSuccess(data);
        },
        onShowFormChange: (showForm) => {
          if (!showForm) {
            useFormRenderer.getState().setFormConfig(null);
          }
        },
        coreData: {
          ...MOCK_ENTITY_DETAILS_CORE_DATA,
          entityDetailsType: tabType,
          leadType: tabData?.leadTypeConfiguration?.[0]?.LeadTypeInternalName
        }
      });
      useFormRenderer.getState().setFormConfig(formConfig);
    }
  };

  const clearErrorIfCalendarView = (actionId: string): void => {
    if (actionId === TaskActionIds.CALENDAR_VIEW) {
      setErrorPage(undefined);
    }
  };

  const handleButtonClick = (action: IHeaderAction): void => {
    if (HEADER_BUTTON_ACTION.includes(action.id) && !action.subMenu?.length) {
      handleMenuItemSelect({
        ...action,
        value: action.value ?? action.id,
        label: action.title
      } as unknown as IMenuItem);
    }
    if (action?.actionType === HeaderActionType.ToggleAction) {
      handleToggleAction(tabId, action.id);
      clearErrorIfCalendarView(action.id);
    }
    if (NON_PROCESS_BUTTON.includes(action.id)) {
      setSelectedHeaderAction({
        label: action.title ?? '',
        value: action.id
      });
    }
    logSVModuleUsage(tabId, action.id);
  };

  const renderMultiProcessIndicator = (action?: IHeaderAction): JSX.Element => {
    return action?.workAreaConfig && action?.subMenu?.length ? (
      <Icon name={'expand_more'} customStyleClass={styles.default_icon} />
    ) : (
      <></>
    );
  };

  const buttonElement = ({
    convertedAction,
    action
  }: {
    convertedAction: IHeaderAction;
    action: IHeaderAction;
  }): JSX.Element => (
    <Button
      text={convertedAction.title ?? ''}
      title={convertedAction.title || ''}
      onClick={() => {
        handleButtonClick(convertedAction);
      }}
      customStyleClass={getCustomStyleClass(action)}
      disabled={action?.disabled}
      icon={action.renderIcon?.() || renderMultiProcessIndicator(convertedAction)}
    />
  );

  const actionWithToggleType = actionConfiguration?.filter(
    (action) => action?.actionType === HeaderActionType.ToggleAction
  );
  const actionWithoutToggleType = actionConfiguration?.filter(
    (action) => action?.actionType !== HeaderActionType.ToggleAction
  );

  return (
    <>
      <div className={classNames(styles.header_actions, customStyles)}>
        {actionWithToggleType?.length ? (
          <div className={styles.toggle_action_container}>
            {actionWithToggleType?.map((action) => {
              const convertedAction = getConvertedAction(action, processFormsData, isLoading);
              return (
                <HeaderActionWrapper
                  convertedAction={convertedAction}
                  action={action}
                  key={action.id}
                  handleMenuItemSelect={handleMenuItemSelect}
                  setSelectedHeaderAction={setSelectedHeaderAction}
                  buttonElement={buttonElement}
                />
              );
            })}
          </div>
        ) : null}

        {actionWithoutToggleType?.map((action) => {
          const convertedAction = getConvertedAction(action, processFormsData, isLoading);
          return (
            <HeaderActionWrapper
              convertedAction={convertedAction}
              action={action}
              key={action.id}
              handleMenuItemSelect={handleMenuItemSelect}
              setSelectedHeaderAction={setSelectedHeaderAction}
              buttonElement={buttonElement}
            />
          );
        })}
      </div>
      {selectedHeaderAction ? (
        <HeaderActionsRenderer selectedAction={selectedHeaderAction} tabId={tabId} />
      ) : null}
    </>
  );
};

HeaderActions.defaultProps = {
  customStyles: ''
};

export default HeaderActions;
