import AvailableFields from './available-fields';
import { IRenderPanelContent } from './tab-settings.types';
import { getClassName, getFilterData } from './utils';
import styles from './tab-settings.module.css';
import SelectedFields from './selected-fields';
import { MAX_ALLOWED_PLACEHOLDER } from './config';
import useTabSettingsStore, { useSelectedFields } from './tab-settings.store';
import { HeaderAction } from 'apps/smart-views/constants/constants';
import { useEffect } from 'react';
import { useActiveTab, useSmartViewSecondaryHeader } from '../../smartview-tab.store';
import { classNames } from 'common/utils/helpers/helpers';

const RenderPanelContent = (props: IRenderPanelContent): JSX.Element => {
  const {
    tabConfig,
    maxAllowed,
    selectedAction,
    data,
    onFilterChange,
    tabType,
    entityExportConfig,
    entityCode,
    entityRepName
  } = props;

  const { selectedExportType } = useTabSettingsStore();

  const selectedFields = useSelectedFields();
  const setFilterDataMap = useTabSettingsStore((state) => state.actions.setFilterDataMap);
  const filterDataMap = useTabSettingsStore((state) => state.filterDataMap);
  const generateFilterData = data?.generateFilterData;
  const tabId = useActiveTab();
  const { filterConfig } = useSmartViewSecondaryHeader(tabId);
  const bySchemaName = filterConfig?.filters?.bySchemaName;

  const rightPanel = tabConfig?.RightPanel;

  useEffect(() => {
    async function mapFilterData(): Promise<void> {
      const filterData = {};
      await Promise.all(
        selectedFields?.map(async (field) => {
          if (filterData[field?.id]) {
            return;
          }
          filterData[field?.id] = filterDataMap?.[field?.id]
            ? filterDataMap?.[field?.id]
            : await getFilterData({ tabId, field, bySchemaName, generateFilterData });
        })
      );
      setFilterDataMap(filterData);
      onFilterChange(filterData);
    }

    mapFilterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFields]);

  const getDescription = (): string => {
    if (!(selectedAction?.value === HeaderAction.ExportLeads && !selectedFields?.length)) {
      return rightPanel?.subtitle || '';
    }
    return '';
  };

  return (
    <div className={classNames(styles.panel, getClassName(selectedAction, selectedExportType))}>
      <div className={styles.left}>
        <AvailableFields
          searchTitle={tabConfig?.LeftPanel?.title || ''}
          selectedAction={selectedAction}
          tabType={tabType}
          entityExportConfig={entityExportConfig}
          entityCode={entityCode}
          entityRepName={entityRepName}
        />
      </div>
      {selectedAction?.value === HeaderAction.SelectColumns ||
      selectedAction?.value === HeaderAction.ExportLeads ? (
        <>
          <div className={styles.divider}></div>
          <div className={styles.right}>
            <SelectedFields
              title={rightPanel?.title || ''}
              description={getDescription()}
              warningMessage={
                rightPanel?.warningMessage?.replace(MAX_ALLOWED_PLACEHOLDER, `${maxAllowed}`) ?? ''
              }
              selectedAction={selectedAction}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default RenderPanelContent;
