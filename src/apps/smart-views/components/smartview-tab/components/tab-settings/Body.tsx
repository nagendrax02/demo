import { ModalBody } from '@lsq/nextgen-preact/v2/modal';
import styles from './tab-settings.module.css';
import { IUseTabSettings } from './useTabSettings';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { IFilterData } from '../../smartview-tab.types';
import useTabSettingsStore, { useMaxAllowedSelection } from './tab-settings.store';
import SelectExportType from './SelectExportType';
import RenderPanelContent from './RenderPanelContent';
import { HeaderAction, TabType } from 'apps/smart-views/constants/constants';
import EntityExportSuccess from './EntityExportSuccess';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IEntityExportConfig, ExportType } from './tab-settings.types';
import { classNames } from 'common/utils/helpers/helpers';

interface IBody {
  data: IUseTabSettings | null;
  selectedAction: IMenuItem | null;
  onFilterChange: (filterDataMap: Record<string, IFilterData>) => void;
  entityRepName: IEntityRepresentationName;
  entityExportConfig?: IEntityExportConfig;
  tabType: TabType;
  entityCode?: string;
}

const renderExportTypes = (
  selectedAction: IMenuItem | null,
  tabType: TabType,
  entityRepName: IEntityRepresentationName
): JSX.Element => {
  return selectedAction?.value === HeaderAction.ExportLeads ? (
    <SelectExportType tabType={tabType} entityRepName={entityRepName} />
  ) : (
    <></>
  );
};

const Body = ({
  data,
  selectedAction,
  onFilterChange,
  entityRepName,
  entityExportConfig,
  tabType,
  entityCode
}: IBody): JSX.Element | null => {
  const tabConfig = data?.tabConfig;
  const maxAllowed = useMaxAllowedSelection();
  const { entityExportSucceeded, selectedExportType } = useTabSettingsStore();

  if (!data) {
    return null;
  }
  return (
    <ModalBody
      customStyleClass={classNames(
        styles.modal_body,
        selectedAction?.value === HeaderAction.ExportLeads &&
          selectedExportType === ExportType.AllFields
          ? styles.export_action
          : null
      )}>
      <>
        {entityExportSucceeded ? (
          <EntityExportSuccess
            entityRepName={entityRepName}
            entityExportConfig={entityExportConfig}
            tabType={tabType}
          />
        ) : (
          <>
            {renderExportTypes(selectedAction, tabType, entityRepName)}
            <RenderPanelContent
              tabConfig={tabConfig}
              maxAllowed={maxAllowed}
              selectedAction={selectedAction}
              data={data}
              onFilterChange={onFilterChange}
              tabType={tabType}
              entityExportConfig={entityExportConfig}
              entityCode={entityCode}
              entityRepName={entityRepName}
            />
          </>
        )}
      </>
    </ModalBody>
  );
};

export default Body;
