import { EntityType } from 'common/types';
import {
  IRecordType,
  ITabConfig
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

interface IGetKeyData {
  records: IRecordType[];
  type: EntityType;
  recordIndex: number;
}

interface ICommonProps {
  records: IRecordType[];
  type: EntityType;
  selectedRecordId: string;
}

interface IHandleNext {
  setFullScreenSelectedRecordId(id: string): void;
  records: IRecordType[];
  selectedRecordId: string;
  type: EntityType;
  tabData: ITabConfig;
  pageIndex: number;
  activeTabId: string;
  apiCallMade: boolean;
  setApiCallMade: React.Dispatch<React.SetStateAction<boolean>>;
  setRecordIndexCount: (value: React.SetStateAction<number>) => void;
}

interface IHandlePrev extends ICommonProps {
  setFullScreenSelectedRecordId(id: string): void;
  setRecordIndexCount: (value: React.SetStateAction<number>) => void;
}

interface IIsPreviousDisabled extends ICommonProps {
  pageIndex: number;
}

interface IIsNextDisabled extends ICommonProps {
  recordLength: number;
  pageIndex: number;
  pageSize: number;
}

enum PositionItem {
  First = 'first',
  Last = 'last'
}

interface IRetrieveBoundaryRecord {
  tabData: ITabConfig;
  pageIndex: number;
  activeTabId: string;
  positionItem: PositionItem;
  setApiCallMade: (value: React.SetStateAction<boolean>) => void;
  records: IRecordType[];
}

interface IRecordDelete {
  tabData: ITabConfig;
  records: IRecordType[];
  type: EntityType;
  selectedRecordId: string;
  setFullScreenSelectedRecordId(id: string): void;
  setRecordIndexCount: (value: React.SetStateAction<number>) => void;
  pageIndex: number;
  activeTabId: string;
  apiCallMade: boolean;
  setApiCallMade: React.Dispatch<React.SetStateAction<boolean>>;
}

export { PositionItem };

export type {
  IHandlePrev,
  IGetKeyData,
  IHandleNext,
  ICommonProps,
  IRecordDelete,
  IIsNextDisabled,
  IIsPreviousDisabled,
  IRetrieveBoundaryRecord
};
