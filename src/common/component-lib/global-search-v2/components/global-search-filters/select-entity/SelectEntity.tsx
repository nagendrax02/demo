import { EntityType } from 'common/types';
import styles from './select-entity.module.css';
import { GlobalSearchEntities } from 'common/component-lib/global-search-v2/constants';
import { setFilters } from 'common/component-lib/global-search-v2/global-searchV2.store';
import { useState, useEffect } from 'react';
import SingleSelect from '@lsq/nextgen-preact/v2/dropdown/single-select';
import KeyboardDownArrow from 'assets/custom-icon/v2/KeyboardDownArrow';
import {
  fetchLeadTypeConfig,
  isLeadTypeEnabled as getIsLeadTypeEnabled
} from 'common/utils/lead-type/settings';
import { CallerSource } from 'common/utils/rest-client';
import { classNames } from 'common/utils/helpers/helpers';
import { ILeadTypeConfig } from 'common/utils/lead-type/lead-type.types';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { convertLeadTypesToMap } from '../../../utils/utils';
export interface IGlobalSearchEntityOptions extends IOption {
  entityType: EntityType;
  leadTypeInternalName?: string;
}
const SelectEntity: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [options, setOptions] = useState<IGlobalSearchEntityOptions[]>([]);
  const [selectedOption, setSelectedOption] = useState<IGlobalSearchEntityOptions | undefined>(
    GlobalSearchEntities[EntityType.Lead]
  );

  useEffect(() => {
    const fetchOptionsData = async (): Promise<void> => {
      const leadTypeEnabled = await getIsLeadTypeEnabled(CallerSource.GlobalSearch, true);
      const leadTypeConfig = leadTypeEnabled
        ? await fetchLeadTypeConfig(CallerSource.GlobalSearch)
        : null;
      if (leadTypeEnabled && leadTypeConfig) {
        const defaultLeadOption = Object.values(leadTypeConfig).find(
          (option: ILeadTypeConfig) => option.IsDefault
        );

        const leadTypeOptions: Record<string, IGlobalSearchEntityOptions> =
          convertLeadTypesToMap(leadTypeConfig);

        const globalSearchEntitiesWithoutLead: IGlobalSearchEntityOptions[] = Object.entries(
          GlobalSearchEntities ?? {}
        )
          .filter(([key]) => key !== EntityType.Lead)
          .map(([, { value, label }]) => ({
            label: label,
            value: value,
            entityType: value
          }));

        const combinedOptions: IGlobalSearchEntityOptions[] = [
          ...Object.values(leadTypeOptions),
          ...globalSearchEntitiesWithoutLead
        ];

        const formattedDefaultOption: IGlobalSearchEntityOptions = defaultLeadOption
          ? {
              label: defaultLeadOption.PluralName,
              value: defaultLeadOption.InternalName,
              entityType: EntityType.Lead,
              leadTypeInternalName: defaultLeadOption.InternalName
            }
          : GlobalSearchEntities[EntityType.Lead];

        setSelectedOption(formattedDefaultOption);

        setOptions(combinedOptions);
        setFilters({
          entityType: EntityType.Lead,
          leadType: defaultLeadOption?.InternalName,
          searchText: ''
        });
      } else {
        setOptions(
          Object.entries(GlobalSearchEntities).map(([, { value, label }]) => ({
            label,
            value,
            text: label,
            entityType: value
          }))
        );
      }
    };

    fetchOptionsData();
  }, []);

  const handleSetSelectedValues = (selected: IGlobalSearchEntityOptions | null): void => {
    if (selected) {
      setFilters({
        entityType: selected.entityType,
        leadType: selected.leadTypeInternalName,
        searchText: ''
      });
      setSelectedOption(selected);
    }
  };

  return (
    <SingleSelect
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      fetchOptions={() => options}
      contentClassName={styles.dropdown_content}
      onSelection={(selected: IGlobalSearchEntityOptions) => {
        handleSetSelectedValues(selected ?? null);
      }}
      selectedOption={selectedOption}>
      <span className={styles.trigger}>
        <span>
          <span
            className={classNames('ng_h_5_b', styles.entity_label)}
            title={selectedOption?.label}>
            {selectedOption?.label}
          </span>
        </span>
        <KeyboardDownArrow type="outline" className={styles.trigger_icon} />
      </span>
    </SingleSelect>
  );
};

export default SelectEntity;
