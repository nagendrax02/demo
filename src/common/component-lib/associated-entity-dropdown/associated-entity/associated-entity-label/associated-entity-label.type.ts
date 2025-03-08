import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';

interface IValue {
  label: string;
  key: string;
}

interface IAssociatedEntityLabel {
  titleKeys: string[];
  body: IValue[];
  config: IOption;
  fallbackTitleKeys: string[];
  showSelectedValueAsText?: boolean;
}

export type { IValue, IAssociatedEntityLabel };
