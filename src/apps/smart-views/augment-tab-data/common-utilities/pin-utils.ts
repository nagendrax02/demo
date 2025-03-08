import {
  IColumn,
  IColumnConfigData,
  IColumnConfigMap
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { HeaderAction } from '../../constants/constants';
import styles from './pin-utils.module.css';
import { ACTION_COLUMN_SCHEMA_NAME } from './constant';

export const getSortedColumnString = (
  columns: string,
  columnConfigMap?: IColumnConfigMap
): string => {
  // sorts the column string, all the pinned columns will be moved to the start of the string
  if (columnConfigMap) {
    let pinnedColumns = Object.keys(columnConfigMap)?.filter(
      (columnKey) => columnConfigMap[columnKey]?.pinnedColumnConfig?.isPinned
    );

    const selectedColumns = columns?.split(',');
    const selectedColumnsSet = new Set(selectedColumns);

    pinnedColumns = pinnedColumns
      ?.map((item) => item.trim())
      ?.filter((item) => selectedColumnsSet?.has(item));

    const pinnedColumnsSet = new Set(pinnedColumns);

    const remainingElements = selectedColumns?.filter((item) => !pinnedColumnsSet?.has(item));

    return pinnedColumns?.concat(remainingElements).join(',');
  }

  return columns;
};

export const getIsFixedColumn = (
  schemaName: string,
  acc: IColumn[],
  columnConfigMap?: IColumnConfigMap
): boolean => {
  if (columnConfigMap) {
    return columnConfigMap?.[schemaName]?.pinnedColumnConfig?.isPinned ?? false;
  }
  return acc.length < 2;
};

export const getIsLastFixedColumn = (
  acc: IColumn[],
  columnConfigMap?: IColumnConfigMap
): boolean => {
  if (columnConfigMap) {
    const validPinnedColumns = Object.keys(columnConfigMap).filter(
      (columnKey) => columnConfigMap[columnKey]?.pinnedColumnConfig?.isPinned
    );
    return acc.length === validPinnedColumns?.length - 1;
  }
  return acc.length === 1;
};

export const canShowPinAction = (selectedAction?: string): boolean => {
  return selectedAction === HeaderAction.SelectColumns;
};

interface IGetPinActionConfig {
  schemaName: string;
  columnConfigMap?: IColumnConfigMap;
  selectedAction?: string;
}

export const getPinActionConfig = ({
  schemaName,
  columnConfigMap,
  selectedAction
}: IGetPinActionConfig): {
  columnConfigData?: IColumnConfigData;
  customStyleClass?: string;
  isDisabled?: boolean;
} => {
  const showPinAction = canShowPinAction(selectedAction);
  if (showPinAction) {
    return {
      columnConfigData: {
        ...columnConfigMap?.[schemaName],
        pinnedColumnConfig: {
          showPinAction,
          canUnpin: columnConfigMap?.[schemaName]?.pinnedColumnConfig?.canUnpin ?? true,
          isPinned: columnConfigMap?.[schemaName]?.pinnedColumnConfig?.isPinned ?? false
        }
      },
      customStyleClass:
        columnConfigMap?.[schemaName]?.pinnedColumnConfig?.canUnpin === false
          ? styles.disable_remove_icon
          : undefined,
      isDisabled: columnConfigMap?.[schemaName]?.pinnedColumnConfig?.canUnpin === false
    };
  }
  return {
    columnConfigData: columnConfigMap?.[schemaName]
  };
};

export const addActionColumn = (selectedColumns: string, index?: number): string => {
  const selectedColumnArray = selectedColumns?.split(',');
  if (!selectedColumnArray?.includes(ACTION_COLUMN_SCHEMA_NAME)) {
    selectedColumnArray?.splice(index ?? 1, 0, ACTION_COLUMN_SCHEMA_NAME);
    return selectedColumnArray?.join(',');
  }
  return selectedColumns;
};

export const removeActionColumn = (selectedColumns: string): string => {
  let selectedColumnArray = selectedColumns?.split(',');
  selectedColumnArray = selectedColumnArray?.filter(
    (column) => column !== ACTION_COLUMN_SCHEMA_NAME
  );
  return selectedColumnArray?.join(',');
};

export const filterColumnConfig = (
  columnConfig: IColumnConfigMap,
  columnsToRetain: string
): IColumnConfigMap => {
  const filteredColumnConfig = Object.keys(columnConfig).reduce((filteredObj, key) => {
    if (columnsToRetain?.split(',').includes(key)) {
      filteredObj[key] = columnConfig[key];
    }
    return filteredObj;
  }, {});

  return filteredColumnConfig;
};

export const getColumnsConfig = (
  defaultColumnConfig: IColumnConfigMap,
  defaultSystemDefinedColumns: string,
  cachedConfig?: IColumnConfigMap
): IColumnConfigMap => {
  const filteredDefaultColumnConfig = filterColumnConfig(
    defaultColumnConfig,
    defaultSystemDefinedColumns
  );

  if (cachedConfig) {
    const cachedConfigKeys = Object.keys(cachedConfig);
    if (
      cachedConfigKeys?.length &&
      Object.keys(filteredDefaultColumnConfig).every((key) => cachedConfigKeys.includes(key))
    )
      return cachedConfig;
  }

  return filteredDefaultColumnConfig;
};
