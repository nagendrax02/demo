import React, { useEffect, useRef } from 'react';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import Modal from '@lsq/nextgen-preact/v2/modal';
import styles from './tab-settings.module.css';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import useTabSettings from './useTabSettings';
import {
  getTabData,
  setCustomFilters,
  setFilterData,
  useSmartViewTab,
  setColumns
} from '../../smartview-tab.store';
import { HeaderAction, TabType } from 'apps/smart-views/constants/constants';
import { IColumnConfigMap, IFilterData } from '../../smartview-tab.types';
import useTabSettingsStore, {
  useFields,
  useSelectedFields,
  useTabSettingsActions
} from './tab-settings.store';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { alertConfig } from './constants';
import { generateSelectColumns, logSVModuleUsage } from 'apps/smart-views/utils/utils';
import { updateSmartViewsTab } from 'apps/smart-views/smartviews-store';
import {
  checkIfExportPossible,
  getAugmentedAvailableFieldsForExport,
  getFilteredCacheSelectedColumns,
  getMaxAllowed,
  getSelectedFields,
  getTaskFieldExistInSelectedFields,
  handleEntityExport,
  handleManageTasksTaskTypeColumnCache,
  resetFilterOptions
} from './utils';
import { ExportType, IEntityExportConfig } from './tab-settings.types';
import { getFilteredSelectedFields } from './selected-fields/utils';
import { getFilteredFields } from './available-fields/utils';
import { TABS_CACHE_KEYS } from 'apps/smart-views/components/custom-tabs/constants';
import { SVUsageWorkArea } from 'common/utils/experience/experience-modules';
import { IGetIsFeatureRestriction } from 'apps/smart-views/smartviews.types';

export interface ITabSettings {
  selectedAction: IMenuItem | null;
  tabId: string;
  show: boolean;
  setShow: (show: boolean) => void;
  entityExportConfig?: IEntityExportConfig;
  featureRestrictionData?: IGetIsFeatureRestriction;
}

// eslint-disable-next-line max-lines-per-function
const TabSettings = (props: ITabSettings): JSX.Element | null => {
  const { selectedAction, tabId, show, setShow, entityExportConfig, featureRestrictionData } =
    props;
  const setFilterDataMap = useTabSettingsStore((state) => state.actions.setFilterDataMap);

  const tabData = useSmartViewTab(tabId);

  const normalizedData = useTabSettings({
    selectedTabType: selectedAction?.value || '',
    tabType: tabData?.type,
    selectedFields: getSelectedFields(
      tabData,
      selectedAction,
      tabData?.gridConfig?.columnConfigMap
    ),
    maxAllowed: getMaxAllowed(tabData, selectedAction, entityExportConfig),
    entityCode: tabData?.entityCode || '',
    tabId: tabData?.id,
    additionalEntityColumns: entityExportConfig?.additionalEntityColumns,
    columnConfigMap: tabData?.gridConfig?.columnConfigMap,
    featureRestrictionData: featureRestrictionData
  });

  const selectedFields = useSelectedFields();

  const { reset, setSelectedFields, selectField, deselectField, setFields } =
    useTabSettingsActions();
  const tabConfig = normalizedData?.tabConfig;
  const filterData = useRef<Record<string, IFilterData>>({});
  const { showAlert } = useNotification();

  const { selectedExportType } = useTabSettingsStore();

  const { setEntityExportSucceeded, setSubmitButtonDisabled, setIsLoading } =
    useTabSettingsStore().actions;

  const allFields = useFields();

  useEffect(() => {
    const filteredSelectedFields = getFilteredSelectedFields({
      selectedAction,
      selectedFields: selectedFields,
      tabType: tabData?.type
    });

    if (selectedAction?.value === HeaderAction.ExportLeads) {
      const cachedSelectedColumns = getFilteredCacheSelectedColumns(allFields, tabData?.type);
      if (cachedSelectedColumns?.length) {
        const fields = getFilteredFields({
          tabType: tabData?.type,
          selectedAction,
          fields: allFields,
          entityCode: tabData?.entityCode
        });
        setFields(getAugmentedAvailableFieldsForExport(fields, cachedSelectedColumns));

        setSelectedFields(cachedSelectedColumns);
      } else setSelectedFields(filteredSelectedFields);
    } else setSelectedFields(filteredSelectedFields);
  }, [selectedExportType]);

  useEffect(
    function setModalState() {
      setShow(true);
    },
    [selectedAction]
  );

  useEffect(() => {
    if (selectedAction?.value === HeaderAction.ExportLeads) {
      const columns = selectedFields?.map((selectedField) => selectedField?.schemaName);
      if (
        selectedExportType === ExportType.SelectedFields &&
        !checkIfExportPossible(columns, tabData?.type)
      ) {
        setSubmitButtonDisabled(true);
      } else {
        setSubmitButtonDisabled(false);
      }
    } else setSubmitButtonDisabled(false);
  }, [selectedFields, selectedExportType]);

  const handleOnClose = (): void => {
    reset();
    setShow(false);
  };

  const handleRestoreDefault = async (): Promise<void> => {
    const systemFilterConfig =
      selectedAction?.value === HeaderAction.ManageFilters
        ? await tabData.tabSettings.getSystemFilterConfig?.()
        : undefined;

    if (systemFilterConfig) {
      filterData.current = systemFilterConfig?.bySchemaName;
      normalizedData?.resetNormalization(systemFilterConfig.selectedFilters?.join(','));
      setFilterDataMap(systemFilterConfig?.bySchemaName);
    } else {
      setSelectedFields(normalizedData?.defaultFields || []);
      resetFilterOptions(filterData.current);
      selectedFields?.map((selectFld) => {
        deselectField({ ...selectFld, isSelected: true });
      });
      normalizedData?.defaultFields?.map((defaultField) => {
        selectField({ ...defaultField, isSelected: false });
      });
    }

    logSVModuleUsage(tabId, selectedAction?.value ?? '', {
      subWorkArea: SVUsageWorkArea.RestoreDefault
    });
  };

  const handleSelectColumnSave = (): void => {
    const columns = generateSelectColumns(
      selectedFields?.map((selectedField) => selectedField?.schemaName)?.join(','),
      tabData?.type
    );

    const columnConfigMap: IColumnConfigMap = selectedFields.reduce((acc, item) => {
      if (item.schemaName && item.columnConfigData) {
        acc[item.schemaName] = item.columnConfigData;
      }
      return acc;
    }, {});

    if (tabData.type === TabType.Task) {
      if (!getTaskFieldExistInSelectedFields(selectedFields)) {
        showAlert(alertConfig.SELECT_AT_LEAST_ONE_TASK_CLM);
        return;
      }
      if (tabData.id === TABS_CACHE_KEYS.MANAGE_TASKS_TAB) {
        handleManageTasksTaskTypeColumnCache(columns?.split(','));
      }
    }

    setColumns(tabId, columns, columnConfigMap);
    showAlert(alertConfig.COLUMN_UPDATED_SUCCESSFUL);
    setShow(false);
  };

  const handleOnSave = async (): Promise<void> => {
    switch (selectedAction?.value) {
      case HeaderAction.ManageFilters:
        setFilterData(filterData.current, tabId);
        setCustomFilters(tabId);
        reset();
        showAlert(alertConfig.FILTER_UPDATE_SUCCESSFUL);
        setShow(false);
        updateSmartViewsTab(
          tabId,
          { ...getTabData(tabId) },
          tabId === TABS_CACHE_KEYS.MANAGE_TASKS_TAB
        );
        logSVModuleUsage(tabId, HeaderAction.ManageFilters, {
          workAreaValue: Object.keys(filterData.current || '{}')?.length
        });
        break;
      case HeaderAction.ExportLeads:
        await handleEntityExport({
          entityExportConfig: entityExportConfig,
          selectedExportType: selectedExportType,
          selectedColumns: selectedFields?.map((selectedField) => selectedField?.schemaName),
          tabType: tabData?.type,
          setEntityExportSucceeded: setEntityExportSucceeded,
          setSubmitButtonDisabled: setSubmitButtonDisabled,
          showAlert: showAlert,
          setIsLoading: setIsLoading,
          tabEntityCode: tabData?.entityCode,
          selectedFields: selectedFields,
          tabId: tabData.id
        });

        break;
      case HeaderAction.SelectColumns:
      default:
        if (selectedFields?.length > 0) {
          handleSelectColumnSave();
          logSVModuleUsage(tabId, HeaderAction.SelectColumns, {
            workAreaValue: selectedFields?.length
          });
        } else {
          showAlert(alertConfig.SELECT_AT_LEAST_ONE_CLM);
        }

        break;
    }
  };

  if (!show) {
    return null;
  }

  const handleFilterChange = (filterDataMap: Record<string, IFilterData>): void => {
    filterData.current = filterDataMap;
  };

  const modalStyleClass =
    selectedAction?.value === HeaderAction?.ManageFilters ? styles.modal_sm : styles.modal_lg;

  return (
    <Modal show={show} customStyleClass={modalStyleClass}>
      <Header
        onClose={handleOnClose}
        config={tabConfig?.Header}
        entityRepName={tabData?.representationName}
        selectedAction={selectedAction}
      />
      <Body
        data={normalizedData}
        selectedAction={selectedAction}
        onFilterChange={handleFilterChange}
        entityRepName={tabData?.representationName}
        entityExportConfig={entityExportConfig}
        tabType={tabData?.type}
        entityCode={tabData?.entityCode}
      />
      <Footer
        onClose={handleOnClose}
        onRestoreDefault={handleRestoreDefault}
        onSave={handleOnSave}
        selectedAction={selectedAction}
      />
    </Modal>
  );
};

TabSettings.defaultProps = {
  entityExportConfig: undefined
};

export default TabSettings;
