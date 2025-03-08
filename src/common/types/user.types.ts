interface IUserOption {
  label: string | null;
  value: string | null;
  category?: string | null;
  isDefault?: boolean | null;
  text?: string | null;
}

interface IUserOptionGroup {
  options: IUserOption[];
  label: string;
}

interface IUserData {
  OptionSet: IUserOptionGroup[];
  Options: IUserOption[];
  SchemaName?: string | null;
}

export type { IUserData, IUserOption, IUserOptionGroup };
