import {
  IAvailableColumnConfig,
  IAvailableField
} from 'apps/smart-views/augment-tab-data/lead/tab-settings';
import Tabs from '@lsq/nextgen-preact/v2/tabs';
import { ITabConfig } from '@lsq/nextgen-preact/v2/tabs/tabs.types';
import NoFieldFound from './NoFieldFound';
import { IEntityExportConfig } from '../tab-settings.types';
import styles from './available-fields.module.css';
import Badge from '@lsq/nextgen-preact/v2/badge';
import { HeaderAction } from 'apps/smart-views/constants/constants';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { classNames } from 'common/utils/helpers/helpers';
import Field from './Field';
import { getSearchTitle } from './utils';
import FieldTooltipWrapper from './FieldTooltipWrapper';
import { useMaxAllowedSelection } from '../tab-settings.store';

interface IEntityFieldTabs {
  searchText: string;
  data: IAvailableColumnConfig[];
  selectedFields: IAvailableField[];
  handleFieldSelection: (metadata: IAvailableField) => void;
  entityExportConfig?: IEntityExportConfig;
  selectedAction: IMenuItem | null;
}

const EntityFieldTabs = ({
  searchText,
  data,
  handleFieldSelection,
  entityExportConfig,
  selectedFields,
  selectedAction
}: IEntityFieldTabs): JSX.Element => {
  const maxAllowedSelection = useMaxAllowedSelection();

  const getTabContent = (fields: IAvailableField[]): JSX.Element => {
    return (
      <div
        className={classNames(
          styles.tab_content,
          'ng_scrollbar',
          selectedAction?.value === HeaderAction.ExportLeads ? styles.export_entity : ''
        )}>
        {fields?.length ? (
          fields.map((metadata) =>
            metadata?.displayName ? (
              <FieldTooltipWrapper
                key={metadata?.schemaName}
                metadata={metadata}
                selectedAction={selectedAction}
                entityExportConfig={entityExportConfig}
                maxAllowedSelection={maxAllowedSelection}
                selectedFields={selectedFields}>
                <Field
                  metadata={metadata}
                  searchText={searchText}
                  handleFieldSelection={handleFieldSelection}
                />
              </FieldTooltipWrapper>
            ) : null
          )
        ) : (
          <NoFieldFound />
        )}
      </div>
    );
  };

  const getTabConfig = (): ITabConfig[] => {
    return data?.map((item) => {
      const title = item?.title?.replace(' Fields', '');
      return {
        id: title,
        title: (
          <div className={classNames(styles.tab_option, 'ng_p_1_sb', 'ng_v2_style')}>
            <div className={styles.tab_title} title={title}>
              {title}
            </div>
            {searchText ? (
              <Badge size="sm" type="regular" status="neutral">
                {item?.data?.length}
              </Badge>
            ) : null}
          </div>
        ),
        content: getTabContent(item?.data)
      };
    });
  };

  if (data?.length === 1) {
    return (
      <>
        {searchText && selectedAction?.value === HeaderAction.SelectColumns ? (
          <div className={styles.entity_fields_title_wrapper}>
            <div
              className={classNames(styles.entity_fields_title, 'ng_p_1_sb', 'ng_v2_style')}
              title={getSearchTitle(data)}>
              {getSearchTitle(data)}
            </div>
          </div>
        ) : null}
        {getTabContent(data?.[0]?.data)}
      </>
    );
  }

  return (
    <Tabs
      tabConfig={getTabConfig()}
      customStyleClass={classNames('ng_scrollbar', styles.tab_wrapper)}
    />
  );
};

export default EntityFieldTabs;
