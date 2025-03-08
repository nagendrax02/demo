interface IGroupedOption {
  label: string;
  value: string;
  group: string;
  secondaryLabel?: string;
  disabled?: boolean;
  menuTooltipMessage?: string;
  inputTooltipMessage?: string;
  menuCustomStyleClass?: string;
  inputCustomStyleClass?: string;
  newlyCreatedOption?: boolean;
}

export interface IOptionRenderer {
  option: IGroupedOption;
  onClear?: (option: IGroupedOption) => void;
}

interface IGroupConfig {
  displayName?: string;
  icon?: string;
  optionsRenderer?: (config: IOptionRenderer) => JSX.Element;
  showSecondaryLabelOnSelect?: boolean;
  customStyleClass?: string;
  displayOrder?: number;
  emptyGroupMessage?: string;
  hideGroup?: boolean;
}

interface ICreateNewOptionConfig {
  optionPlaceholder: string;
  group: string;
  canCreateNewOption: (inputText: string, searchedOptions: IGroupedOption[]) => boolean;
  getNewlyCreatedOption: (inputText: string) => IGroupedOption;
}

type AugmentedGroupedOption = Record<string, IGroupedOption[]>;

type GroupConfig = Record<string, IGroupConfig>;

export type {
  IGroupedOption,
  GroupConfig,
  IGroupConfig,
  AugmentedGroupedOption,
  ICreateNewOptionConfig
};
