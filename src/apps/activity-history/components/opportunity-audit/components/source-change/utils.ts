import { IColumnConfig } from '@lsq/nextgen-preact/table/table.types';

export const getColumnConfig = (isOldAndNewValueSame?: boolean): IColumnConfig[] => {
  if (isOldAndNewValueSame) {
    return [
      {
        field: 'Field',
        key: 'DisplayName',
        width: 150
      },
      {
        field: 'Old Value',
        key: 'OldValue',
        width: 250
      },
      {
        field: 'New Value',
        key: 'NewValue',
        width: 250
      }
    ];
  }

  return [
    {
      field: 'Field',
      key: 'DisplayName',
      width: 150
    },
    {
      field: 'Value',
      key: 'Value',
      width: 250
    }
  ];
};
