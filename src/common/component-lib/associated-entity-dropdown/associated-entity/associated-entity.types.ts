import { IDropdown, IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IValue } from './associated-entity-label/associated-entity-label.type';

interface IDisplayConfig {
  titleKeys: string[];
  body: IValue[];
  fallbackTitleKeys?: string[];
}

interface IAssociatedEntityDropdown extends IDropdown {
  displayConfig: IDisplayConfig;
  valueKey: string;
  openInNewTabHandler?: (data?: IOption) => void;
  fetchOptions: (
    searchText?: string,
    currentPrimaryContactId?: string
  ) => Promise<IOption[]> | IOption[];
  currentPrimaryContactId?: string;
}

export type { IAssociatedEntityDropdown, IDisplayConfig };
