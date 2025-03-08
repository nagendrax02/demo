import {
  IAvailableColumnConfig,
  IAvailableField
} from 'apps/smart-views/augment-tab-data/common-utilities/common.types';

const getColumnConfig = (): {
  fields: IAvailableColumnConfig[];
  selectedFields: IAvailableField[];
  defaultFields: IAvailableField[];
} => {
  return {
    fields: [],
    selectedFields: [],
    defaultFields: []
  };
};

export { getColumnConfig };
