import { ConditionEntityType, SCHEMA_NAMES } from 'apps/smart-views/constants/constants';
import { EntityType } from 'common/types';
import styles from './filter-renderer.module.css';

export enum FilterRenderType {
  GroupedMSWithoutSelectAll, // grouped multi-select and each option should be selected individually
  MSWithoutSelectAll, // multi-select without select all option
  DateTime,
  UserDropdown,
  TaskType,
  OppType,
  SearchableSingleSelect,
  None
}

export const DEFAULT_RENDER_TYPE = FilterRenderType.None;

export const BridgeEntityMap = {
  [ConditionEntityType?.Lead]: EntityType.Lead
};

export const PLACE_HOLDER = 'Type to Search';

export const OptionSeperator = {
  DateSeparator: ' TO ',
  MXSeparator: 'MXDATASEPERATOR',
  CommaSeparator: ',',
  SemicolonSeparator: ';'
};

export const DATE_FILTER = {
  CUSTOM: 'custom',
  [7]: '7',
  [30]: '30',
  SEVEN: 'seven',
  THIRTY: 'thirty',
  ALL_TIME: 'all_time',
  DEFAULT_OPTION: {
    value: 'all_time',
    label: 'All Time',
    startDate: '',
    endDate: ''
  }
};

export const TASK_CATEGORY_OPTIONS = [
  {
    value: '0',
    label: 'All Appointment Tasks'
  },
  {
    value: '1',
    label: 'All To Do Tasks'
  }
];

export const NOT_SET = { value: '{{MXEmpty}}', label: 'Not Set', text: '' };

export const ALL_TASK_TYPE_VALUE = '-1';

export const ACCOUNT_CONFIG = {
  titleKeys: ['AccountName'],
  body: [
    { key: 'AutoId', label: 'Auto Id' },
    { key: 'Phone', label: 'Phone Number' },
    { key: 'Address', label: 'Address' },
    { key: 'AccountTypeName', label: 'Account Type' }
  ]
};

export const CUSTOM_FILTER_STYLE_MAP = {
  [SCHEMA_NAMES?.RELATED_COMPANY_ID]: styles.account_filter
};
