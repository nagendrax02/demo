import { ActivityBaseAttributeDataType, DataType, RenderType } from 'common/types/entity/lead';
import {
  IColumn,
  IColumnConfigData,
  IColumnConfigMap,
  IFilterData
} from '../../components/smartview-tab/smartview-tab.types';
import { ConditionEntityType, TabType } from '../../constants/constants';
import { IGetIsFeatureRestriction } from '../../smartviews.types';

interface IAugmentedSmartViewEntityMetadata {
  schemaName: string;
  displayName: string;
  renderType: RenderType;
  isCFS?: boolean;
  parentSchemaName?: string | null;
  dataType?: DataType | ActivityBaseAttributeDataType;
  cfsDisplayName?: string;
  parentField?: string;
  isSortable?: boolean;
  conditionEntityType?: ConditionEntityType;
  ShowInForm?: boolean;
  BaseTable?: string;
  GroupName?: string;
  IsMultiSelectDropdown?: boolean;
}

interface IAvailableField extends IAugmentedSmartViewEntityMetadata {
  id: string;
  label: string;
  isRemovable: boolean;
  isSelected?: boolean;
  type?: TabType;
  isDisabled?: boolean;
  isRestricted?: boolean;
  isDraggable?: boolean;
  badgeText?: string;
  columnConfigData?: IColumnConfigData;
  customStyleClass?: string;
}

interface IAvailableColumnConfig {
  title: string;
  type: TabType;
  data: IAvailableField[];
}

interface IGetFieldsConfig {
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  selectedColumns: string;
  maxAllowed: number;
  entityType: TabType;
  entityCode?: string;
  customFieldTransformer?: (field: IAvailableField) => IAvailableField | null;
  schemaPrefix?: string;
  repNameMap?: Record<string, string>;
  selectedAction?: string;
  columnConfigMap?: IColumnConfigMap;
}

interface IAugmentedTabSettingsDataParams {
  selectedFieldsSchema?: string;
  maxAllowed?: number;
  entityCode?: string;
  tabId?: string;
  selectedHeaderAction?: string;
  relatedEntityCode?: string;
  columnConfigMap?: IColumnConfigMap;
  featureRestrictionData?: IGetIsFeatureRestriction;
}

type IGenerateFilterData = (
  schemaName: string,
  tabType: TabType,
  entityCode: string
) => Promise<IFilterData>;

type IAugmentedTabSettingsDataMethod = {
  (config: IAugmentedTabSettingsDataParams): Promise<{
    fields: IAvailableColumnConfig[];
    selectedFields: IAvailableField[];
    defaultFields?: IAvailableField[];
    generateFilterData?: IGenerateFilterData;
  }>;
};

type IGetColumnConfig = {
  entityCode?: string;
  columns: string;
  tabId: string;
  columnWidthConfig?: Record<string, number>;
  actionsLength?: number;
  relatedEntityCode?: string;
  canShowActionColumn?: boolean;
  columnConfigMap?: IColumnConfigMap;
};
interface IColumnConfig {
  columns: string;
  gridColumns: IColumn[];
}

export type {
  IAvailableColumnConfig,
  IAvailableField,
  IGetFieldsConfig,
  IAugmentedTabSettingsDataMethod,
  IAugmentedTabSettingsDataParams,
  IAugmentedSmartViewEntityMetadata,
  IGenerateFilterData,
  IColumnConfig,
  IGetColumnConfig
};
