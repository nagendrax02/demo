import { trackError } from 'common/utils/experience/utils/track-error';
import { IFilter, IFilterConfig, IFilterData } from '../../smartview-tab.types';
import { BridgeEntityMap, DEFAULT_RENDER_TYPE } from './constants';
import filterRenderMap from './filter-render-map';
import { ICommonFilterProps } from './filter-renderer.types';
import { getFilterMethods } from './utils';
import { IDateOption } from 'common/component-lib/date-filter';
import { getActiveTab, getTabData, setOpenFilter } from '../../smartview-tab.store';
import { EntityType } from 'common/types';
import { getStringifiedLeadType } from 'apps/smart-views/augment-tab-data/common-utilities/utils';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { getActiveTabId } from 'apps/smart-views/smartviews-store';

interface IFilterRenderer {
  filterData: IFilterData;
  schemaName: string;
  tabId: string;
  onFilterChange: (filterValue: IFilterData, schemaName: string) => void;
  bySchemaName: IFilterConfig;
  filters: IFilter;
}

const FilterRenderer = (props: IFilterRenderer): JSX.Element => {
  const { filterData, bySchemaName, schemaName, tabId, onFilterChange, filters } = props;
  const renderType = filterData?.renderType ?? DEFAULT_RENDER_TYPE;
  const entityType = filterData?.entityType;

  const Component = filterRenderMap[renderType] as React.FC<ICommonFilterProps>;

  const handleFetchOptions = async (searchText: string): Promise<IOption[]> => {
    const fetchOptions =
      filterData?.customCallbacks?.fetchOptions ||
      (await getFilterMethods(entityType))?.fetchOptions;

    const tabData = getTabData(tabId);
    const fetchOptionsRelatedData = {
      entityType: BridgeEntityMap[entityType] as EntityType,
      filterConfig: filterData,
      bySchemaName: bySchemaName,
      leadType: await getStringifiedLeadType(tabData.id)
    };

    return (
      fetchOptions?.(
        {
          searchText,
          schemaName,
          code: tabData?.entityCode,
          relatedEntityCode: tabData.relatedEntityCode
        },
        fetchOptionsRelatedData
      ) || []
    );
  };

  const handleOpenChange = (isOpen: boolean): void => {
    setOpenFilter(getActiveTabId() || getActiveTab(), isOpen ? schemaName : '');
  };

  const handleOnChange = async (option: IOption[] | IDateOption): Promise<void> => {
    try {
      const getFilterValue = (await getFilterMethods(filterData?.entityType))?.getFilterValue;
      const onChange = filterData?.customCallbacks?.onChange;
      const { type, entityCode } = getTabData(tabId);
      const filterValue = onChange
        ? onChange?.(option)
        : await getFilterValue?.({
            selectedOption: option,
            schemaName,
            tabType: type,
            entityCode: filterData?.entityCode ?? entityCode,
            utcDateFormatEnabled: filterData?.utcDateFormatEnabled
          });
      if (filterValue) {
        onFilterChange({ ...filterData, ...filterValue }, schemaName);
      }
    } catch (error) {
      trackError(error);
    }
  };

  return (
    <>
      {filterData?.label && Component ? (
        <Component
          defaultValues={filterData?.selectedValue}
          fetchOptions={handleFetchOptions}
          onChange={handleOnChange}
          isDisabled={filterData?.isDisabled}
          enableDateTimePicker={filterData?.enableDateTimePicker}
          includeSecondsForEndDate={filterData?.includeSecondsForEndDate}
          bySchemaName={bySchemaName}
          schemaName={schemaName}
          avoidUTCFormatting={filterData?.avoidUTCFormatting}
          filterLabel={filterData?.label}
          filters={filters}
          onOpenChange={handleOpenChange}
        />
      ) : null}
    </>
  );
};

FilterRenderer.defaultProps = {
  showDefaultValueText: false,
  customOptionStyle: ''
};

export default FilterRenderer;
