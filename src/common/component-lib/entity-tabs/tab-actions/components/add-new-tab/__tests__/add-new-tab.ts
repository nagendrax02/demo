export const addNewTabMock = [
  {
    EntityType: null,
    Id: 'newTabId',
    IsEnabled: false,
    RestrictedRoles: null,
    ShowInMobile: false,
    ShowInWeb: true,
    TabConfiguration: {
      IsDefault: false,
      Location: null,
      Position: 0,
      Sequence: 1,
      ShowInForm: true,
      TabPosition: 0,
      Title: 'new tab name'
    },
    TabContentConfiguration: {
      Activities: 'Text1',
      CanClone: true,
      CanDelete: true,
      CanEdit: true,
      From: 'mindate',
      OnClick: 'LoadActivityHistory(newTabId)',
      OptFilter: 'opt-all-time',
      Title: 'new tab name',
      To: 'maxdate',
      URL: null,
      Width: null
    },
    Type: 2
  }
];
