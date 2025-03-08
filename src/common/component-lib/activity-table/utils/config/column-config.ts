import { IColumnConfig } from '../../activity-table.types';

const createColumnConfig = (
  fieldValue: string,
  keyValue: string,
  widthValue: number
): IColumnConfig => {
  return { field: fieldValue, key: keyValue, width: widthValue };
};

export const getDefaultColumnConfig = (): IColumnConfig[] => {
  return [
    createColumnConfig('Field', 'DisplayName', 150),
    createColumnConfig('Value', 'Value', 300)
  ];
};

export const getNewAndOldValueColumnConfig = (): IColumnConfig[] => {
  return [
    createColumnConfig('Field', 'DisplayName', 200),
    createColumnConfig('Old Value', 'OldValue', 200),
    createColumnConfig('New Value', 'NewValue', 200)
  ];
};

export const getOppCaptureColumnConfig = (): IColumnConfig[] => {
  return [
    createColumnConfig('Field', 'DisplayName', 200),
    createColumnConfig('Value', 'Value', 500)
  ];
};

export const getMediumColumnConfig = (): IColumnConfig[] => {
  return [
    createColumnConfig('Field', 'DisplayName', 150),
    createColumnConfig('Value', 'Value', 350)
  ];
};
