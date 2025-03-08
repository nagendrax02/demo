export interface IDisableSalesActivitySetting {
  EnableConfiguration: string;
  Settings: {
    RetrictUsersFromNewActivity: boolean;
    RestrictCompleteAccess: boolean;
  };
}
