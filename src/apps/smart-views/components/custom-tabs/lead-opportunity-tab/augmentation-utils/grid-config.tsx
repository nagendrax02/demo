import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from 'common/constants';
import { EntityType } from 'common/types';
import { safeParseJson } from 'common/utils/helpers';
import {
  addAccountColumns,
  getSortConfig
} from 'apps/smart-views/augment-tab-data/common-utilities/utils';
import {
  customColumnDefs,
  leadInfoColumns
} from 'apps/smart-views/augment-tab-data/opportunity/constants';
import {
  augmentResponse,
  getGridColumns as getOppGridColumns
} from 'apps/smart-views/augment-tab-data/opportunity/opportunity';
import { RowHeightType } from 'apps/smart-views/constants/constants';
import RowDetail from 'apps/smart-views/components/cell-renderers/row-details';
import {
  IColumn,
  IColumnConfigMap,
  IGetGridConfig,
  IGridConfig,
  IMarvinData,
  IRecordType
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { getRowActions } from './row-action-config';
import { ANY_OPPORTUNITY, DEFAULT_COLUMNS } from '../constants';
import { IFetchCriteria, ITabResponse } from 'src/apps/smart-views/smartviews.types';
import { IAugmentedSmartViewEntityMetadata } from 'apps/smart-views/augment-tab-data/common-utilities/common.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { fetchOppTypeOptions } from '../fetch-options';
import { getOpportunityRepName } from 'apps/smart-views/utils/utils';
import {
  addActionColumn,
  getColumnsConfig
} from '../../../../augment-tab-data/common-utilities/pin-utils';
import { DEFAULT_COLUMN_CONFIG_MAP } from '../../../../augment-tab-data/common-utilities/constant';

const getAdditionalData = (fetchCriteria?: IFetchCriteria): IMarvinData => {
  return (safeParseJson(fetchCriteria?.AdditionalData || '') as IMarvinData) || {};
};

const getAdvancedSearchText = (tabData: ITabResponse): string => {
  const tabFetchCriteria = tabData?.TabContentConfiguration?.FetchCriteria;
  const additionalData = safeParseJson(tabFetchCriteria?.AdditionalData) as IMarvinData;
  return additionalData?.Marvin?.AdvancedSearchText || '';
};

const getOppTypeColumn = async (): Promise<IColumn | undefined> => {
  try {
    const oppTypeOptions = (await fetchOppTypeOptions()) || [];
    const representationName = await getOpportunityRepName();

    const getOppType = (record: IRecordType): string => {
      const oppType = oppTypeOptions.filter((option) => option.value === record.ActivityEvent)?.[0]
        ?.label;
      return oppType || '';
    };

    const oppTypeColumnDef: IColumn = {
      id: 'Opportunity_Type',
      displayName: `${representationName?.SingularName} Type`,
      sortable: false,
      resizable: true,
      sortKey: 'Opportunity_Type',
      width: 200,
      minWidth: 200,
      CellRenderer: ({ record }: { record: IRecordType }) => <>{getOppType(record)}</>
    };

    return oppTypeColumnDef;
  } catch (error) {
    trackError(error);
  }
};

const getGridColumns = async ({
  columnString,
  columnWidthConfig,
  actionsLength,
  code,
  metaDataMap,
  leadRepName,
  tabId,
  columnConfigMap
}: {
  code: string;
  columnString: string;
  tabId: string;
  columnWidthConfig?: Record<string, number>;
  actionsLength?: number;
  metaDataMap?: Record<string, IAugmentedSmartViewEntityMetadata>;
  leadRepName?: IEntityRepresentationName;
  columnConfigMap?: IColumnConfigMap;
}): Promise<IColumn[]> => {
  const columns = await getOppGridColumns({
    columnString,
    columnWidthConfig,
    actionsLength,
    code,
    metaDataMap,
    leadRepName,
    tabId,
    columnConfigMap
  });

  if (code === ANY_OPPORTUNITY) {
    const oppTypeColumn = await getOppTypeColumn();
    // Inserting oppType column after actions
    if (oppTypeColumn) columns.splice(2, 0, oppTypeColumn);
  }

  return columns;
};

export const getGridConfig = async ({
  tabData,
  customFilters,
  selectedColumns,
  commonTabSettings,
  entityMetadata,
  representationName,
  userPermissions
}: IGetGridConfig): Promise<IGridConfig> => {
  const {
    Id,
    TabContentConfiguration: { FetchCriteria, Actions }
  } = tabData;

  const additionalData = getAdditionalData(FetchCriteria);

  const defaultColumns = addActionColumn(DEFAULT_COLUMNS.join(','));

  const fetchCriteria = {
    PageIndex: 1,
    Code: tabData.EntityCode,
    PageSize: parseInt(FetchCriteria.PageSize),
    Columns: defaultColumns,
    SearchText: '',
    CustomFilters: customFilters,
    IsOpportunity: true,
    AdvancedSearch: getAdvancedSearchText(tabData),
    ...getSortConfig(FetchCriteria.SortedOn || '', customColumnDefs)
  };

  if (additionalData?.Marvin?.Exists) {
    const marvinData = { ...additionalData.Marvin };
    fetchCriteria.SearchText = marvinData.SearchText;
    fetchCriteria.Columns = addActionColumn(
      addAccountColumns(selectedColumns?.length ? selectedColumns : marvinData.Columns, 'P_')
    );
    const sortConfig = { ...getSortConfig(marvinData.SearchSortedOn || '', customColumnDefs) };
    if (sortConfig) {
      fetchCriteria.SortOn = sortConfig.SortOn;
      fetchCriteria.SortBy = sortConfig.SortBy;
    }
  }

  const columnConfigMap = getColumnsConfig(
    DEFAULT_COLUMN_CONFIG_MAP.Opportunity,
    defaultColumns,
    additionalData?.Marvin?.columnConfigMap
  );

  const rowActions = await getRowActions({
    actionConfig: Actions,
    userPermissions,
    opportunityType: tabData.EntityCode
  });

  const config: IGridConfig = {
    apiRoute: API_ROUTES.smartviews.activityGet,
    disableSelection: commonTabSettings?.disableSelection,
    allowRowSelection: false,
    fetchCriteria,
    requiredColumns: leadInfoColumns,
    rowHeight: RowHeightType.Default,
    tabColumnsWidth: additionalData?.Marvin?.tabColumnsWidth,
    actions: { rowActions: { ...rowActions } },
    columns: await getGridColumns({
      columnString: fetchCriteria.Columns,
      columnWidthConfig: additionalData?.Marvin?.tabColumnsWidth,
      actionsLength: rowActions?.quickActions?.length,
      code: tabData.EntityCode,
      metaDataMap: entityMetadata,
      leadRepName: representationName,
      tabId: tabData.Id,
      columnConfigMap
    }),
    expandableComponent: ({ item }) => (
      <RowDetail item={item} entityType={EntityType.Opportunity} tabId={Id} />
    ),
    augmentResponse: (data) => {
      return augmentResponse(data, entityMetadata, Id);
    },
    columnConfigMap
  };

  return config;
};
