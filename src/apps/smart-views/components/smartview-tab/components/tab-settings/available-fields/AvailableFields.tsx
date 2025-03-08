import {
  useFields,
  useMaxAllowedSelection,
  useSelectedFields,
  useTabSettingsActions
} from '../tab-settings.store';
import styles from './available-fields.module.css';
import {
  IAvailableColumnConfig,
  IAvailableField
} from 'apps/smart-views/augment-tab-data/lead/tab-settings';
import { useState } from 'react';
import SearchBar from '@lsq/nextgen-preact/v2/text-field/search-bar';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { HeaderAction, TabType } from 'apps/smart-views/constants/constants';
import { getFilteredFields, getSelectedColumnsTitle } from './utils';
import { IEntityExportConfig } from '../tab-settings.types';
import EntityFieldTabs from './EntityFieldTabs';
import { classNames } from 'common/utils/helpers/helpers';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import Badge from '@lsq/nextgen-preact/v2/badge';

interface IAvailableFields {
  searchTitle: string;
  entityExportConfig?: IEntityExportConfig;
  selectedAction: IMenuItem | null;
  tabType: TabType;
  entityCode?: string;
  entityRepName: IEntityRepresentationName;
}

const AvailableFields = ({
  searchTitle,
  entityExportConfig,
  selectedAction,
  tabType,
  entityCode,
  entityRepName
}: IAvailableFields): JSX.Element => {
  const [searchText, setSearchText] = useState('');
  const fields = getFilteredFields({
    tabType,
    selectedAction,
    fields: useFields(),
    entityCode: entityCode
  });

  const { selectField, deselectField, updateSelectedFields } = useTabSettingsActions();
  const selectedFields = useSelectedFields();
  const maxAllowed = useMaxAllowedSelection();

  const handleFieldSelection = (metadata: IAvailableField): void => {
    updateSelectedFields(metadata);
    if (metadata?.isSelected) {
      deselectField(metadata);
    } else {
      selectField(metadata);
    }
  };

  const getMatchedFields = (): IAvailableColumnConfig[] => {
    if (!searchText?.trim()?.length) {
      return fields;
    }
    return fields?.map((field) => {
      return {
        ...field,
        data: field?.data?.filter((metadata) => {
          return metadata?.displayName?.toLowerCase()?.includes(searchText?.toLowerCase());
        })
      };
    });
  };

  const handleSearch = (value: string): void => {
    setSearchText(value);
  };

  const matchedFields = getMatchedFields();

  /* We are using maxAllowed - 1 since action column is not included in the total selected columns count */
  const badgeText = `${selectedFields?.length - 1}/${maxAllowed - 1}`;
  const maxLimitReached = selectedFields?.length - 1 >= maxAllowed - 1;

  return (
    <div className={styles.wrapper}>
      {searchTitle ? (
        <div className={classNames(styles.search_title, 'ng_v2_style', 'ng_h_5_b')}>
          {getSelectedColumnsTitle({
            title: searchTitle,
            selectedAction,
            entityRepName,
            matchedFields
          })}
          {selectedAction?.value === HeaderAction.SelectColumns ? (
            <Badge size="sm" status={maxLimitReached ? 'failed' : 'neutral'} type="regular">
              {badgeText}
            </Badge>
          ) : null}
        </div>
      ) : null}
      <div className={styles.search_input}>
        <SearchBar onChange={handleSearch} value={searchText} size="xs" />
      </div>
      <EntityFieldTabs
        searchText={searchText}
        data={matchedFields}
        handleFieldSelection={handleFieldSelection}
        entityExportConfig={entityExportConfig}
        selectedFields={selectedFields}
        selectedAction={selectedAction}
      />
    </div>
  );
};

export default AvailableFields;
