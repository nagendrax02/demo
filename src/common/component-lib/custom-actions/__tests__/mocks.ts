import { IConnectorConfig } from 'src/common/types/entity/lead';

export const actions = [
  {
    ShowInWeb: true,
    ShowInMobile: false,
    InstanceSpecific: false,
    InstanceId: '',
    Id: '00e90922-7a90-4221-a06a-d69aefb80d08',
    Category: 'Custom Actions',
    Config: {
      IsEnabled: true,
      DisplayText: 'Open In New Window',
      RestrictedRoles: '[]',
      Action: 'OpenNewWindow',
      ActionConfig: {
        URL: 'https://reqres.in/',
        Method: 'GET',
        ContentType: 'apppliation/json',
        Title: 'Open In New Window'
      }
    }
  },
  {
    ShowInWeb: true,
    ShowInMobile: false,
    InstanceSpecific: false,
    InstanceId: '',
    Id: '519354c8-3c0e-4047-a4f4-9400b0e72251',
    Category: 'Custom Actions',
    Config: {
      IsEnabled: true,
      DisplayText: 'Call an API - Post',
      RestrictedRoles: '[]',
      Action: 'CallAPI',
      ActionConfig: {
        URL: 'https://pop123.free.beeceptor.com?org=@{Account:ShortCode, }',
        Method: 'POST',
        ContentType: 'apppliation/json',
        Data: 'data',
        Title: 'Call an API - Post'
      }
    }
  },
  {
    ShowInWeb: true,
    ShowInMobile: false,
    InstanceSpecific: false,
    InstanceId: '',
    Id: '7ff500cd-aaac-4d24-b8df-3e706d7d968c',
    Category: 'Custom Actions',
    Config: {
      IsEnabled: true,
      DisplayText: 'Call an API - Get',
      RestrictedRoles: '[]',
      Action: 'CallAPI',
      ActionConfig: {
        URL: 'https://jsonplaceholder.typicode.com/users',
        Method: 'GET',
        ContentType: 'apppliation/json',
        Title: 'Call an API - Get'
      }
    }
  },
  {
    ShowInWeb: true,
    ShowInMobile: false,
    InstanceSpecific: false,
    InstanceId: '',
    Id: 'c84be117-824b-403e-bbc9-3384ddbb2c75',
    Category: 'Custom Actions',
    Config: {
      IsEnabled: true,
      DisplayText: 'Show Popup Action - Get',
      RestrictedRoles: '[]',
      Action: 'ShowPopup',
      ActionConfig: {
        URL: 'https://help.leadsquared.com/',
        Method: 'GET',
        ContentType: 'appplication/json',
        Title: 'Show Popup Action - Get'
      }
    }
  },
  {
    ShowInWeb: true,
    ShowInMobile: false,
    InstanceSpecific: false,
    InstanceId: '',
    Id: 'c7b54344-b233-4099-b1e8-dbba4b43987c',
    Category: 'Custom Actions',
    Config: {
      IsEnabled: true,
      DisplayText: 'Show as Popup - Post',
      RestrictedRoles: '[]',
      Action: 'ShowPopup',
      ActionConfig: {
        URL: 'https://showpop.free.beeceptor.com',
        Method: 'POST',
        ContentType: 'apppliation/json',
        Data: 'yuiop',
        Title: 'Show as Popup - Post',
        IframeAttribute: 'height=500px&width=1000px'
      }
    }
  }
] as IConnectorConfig[];

export const mailMergedRes = [
  '{"configURL":"https://reqres.in/"}',
  '{"configURL":"https://pop123.free.beeceptor.com?org=9695","configData":{"data": 1}}',
  '{"configURL":"https://pop123.free.beeceptor.com?org=9695"}',
  '{"configURL":"https://help.leadsquared.com/"}',
  '{"configURL":"https://showpop.free.beeceptor.com","configData":{"data": 1}}'
];
