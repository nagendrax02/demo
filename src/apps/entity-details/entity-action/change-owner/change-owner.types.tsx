import { ReactNode } from 'react';

interface IOwnerDropdown {
  setShowError: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedOption: React.Dispatch<
    React.SetStateAction<
      {
        value: string;
        label: string;
      }[]
    >
  >;
  showError: boolean;
  selectedOption: {
    value: string;
    label: string;
  }[];
}

interface IResponse {
  SchemaName: null;
  Options: IResponseOption[];
  OptionSet: null;
}

interface IResponseOption {
  value: string;
  label: string;
  text?: string;
  category?: null;
  isDefault?: boolean;
  customComponent?: ReactNode;
}

export type { IOwnerDropdown, IResponse, IResponseOption };
