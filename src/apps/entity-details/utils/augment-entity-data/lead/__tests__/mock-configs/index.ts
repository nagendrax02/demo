import { LEAD_QUICK_ACTION_CONFIG } from 'apps/entity-details/constants';
import { IAugmentedEntity, IconContentType, ComponentType } from 'apps/entity-details/types';
import { IActionConfiguration, IConnectorConfiguration, ILead } from 'common/types/entity/lead';
import { IAugmentedAction } from 'apps/entity-details/types/entity-data.types';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import { workAreaIds } from 'common/utils/process';
import { CallerSource } from 'common/utils/rest-client';
import { leadFeatureRestrictionConfigMap } from '../../constants';
import { FeatureRestrictionModuleTypes } from 'common/utils/feature-restriction/feature-restriction.types';

const actionsAugmentationMock = [
  {
    id: 'Call',
    title: 'Call',
    type: 'Button',
    sequence: 2,
    renderAsIcon: false,
    actionHandler: {},
    disabled: true,
    toolTip: 'Number is not present'
  },
  {
    id: 'SendEmail',
    title: 'Email',
    type: 'Button',
    sequence: 3,
    renderAsIcon: false,
    actionHandler: {},
    subMenu: [
      {
        id: 'SendEmailAction',
        label: 'Send Email',
        value: 'SendEmailAction',
        disabled: false
      },
      {
        id: 'ViewScheduledEmail',
        label: 'View Scheduled Email',
        value: 'ViewScheduledEmail'
      }
    ]
  },
  {
    id: 'db8b126c-a53d-4ebc-a613-0033915d93be',
    title: 'LG Row Action 1',
    type: 'Dropdown',
    sequence: 6,
    connectorConfig: {
      Id: 'db8b126c-a53d-4ebc-a613-0033915d93be',
      Category: 'Custom Actions',
      Config: {
        DisplayText: 'LG Row Action 1',
        ActionConfig: {
          Title: 'LG Row Action 1'
        }
      }
    },
    actionHandler: {}
  },
  {
    id: 'ba69b416-7a7c-4238-ada5-151601517e21',
    title: 'LG Row Action 2',
    type: 'Dropdown',
    sequence: 7,
    connectorConfig: {
      Id: 'ba69b416-7a7c-4238-ada5-151601517e21',
      Category: 'Custom Actions',
      Config: {
        DisplayText: 'LG Row Action 2',
        ActionConfig: {
          Title: 'LG Row Action 2'
        }
      }
    },
    actionHandler: {}
  },
  {
    id: '7b315991-6d21-47fb-b088-8ed759298dbb',
    title: 'Send SMS v3',
    type: 'Dropdown',
    sequence: 9,
    connectorConfig: {
      Id: '7b315991-6d21-47fb-b088-8ed759298dbb',
      Category: 'Messaging',
      Config: {
        DisplayText: 'Send SMS v3',
        RestrictedRoles: 'Sales_User,Marketing_User,Sales_Manager',
        ActionConfig: {
          Title: 'Send SMS v3'
        }
      }
    },
    actionHandler: {}
  },
  {
    title: 'Processes',
    id: 'Processes',
    type: 'Button',
    icon: '',
    sequence: 999,
    workAreaConfig: { workAreaId: workAreaIds.LEAD_DETAILS.ADD_ACTIVITY },
    actionHandler: {}
  }
];
const connectorConfigurationMock = {
  Messaging: [
    {
      Id: '7b315991-6d21-47fb-b088-8ed759298dbb',
      Category: 'Messaging',
      Config: {
        DisplayText: 'Send SMS v3',
        RestrictedRoles: 'Sales_User,Marketing_User,Sales_Manager',

        ActionConfig: {
          Title: 'Send SMS v3'
        }
      }
    }
  ],

  //For testing cases
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'Custom Actions': [
    {
      Id: 'db8b126c-a53d-4ebc-a613-0033915d93be',
      Category: 'Custom Actions',
      Config: {
        DisplayText: 'LG Row Action 1',

        ActionConfig: {
          Title: 'LG Row Action 1'
        }
      }
    },
    {
      Id: 'ba69b416-7a7c-4238-ada5-151601517e21',
      Category: 'Custom Actions',
      Config: {
        DisplayText: 'LG Row Action 2',
        ActionConfig: {
          Title: 'LG Row Action 2'
        }
      }
    }
  ]
};
const actionConfigurationMock = [
  {
    Name: 'Call',
    Title: 'Call',
    Type: 'Button',
    Sequence: 2,
    IsConnectorAction: false,
    ConnectorCategory: null,
    RenderAsIcon: false
  },
  {
    Name: 'SendEmail',
    Title: 'SendEmail',
    Type: 'Button',
    Sequence: 3,
    IsConnectorAction: false,
    ConnectorCategory: null,
    RenderAsIcon: false
  },

  {
    Name: 'db8b126c-a53d-4ebc-a613-0033915d93be',
    Title: 'Custom Actions - LG Row Action 1',
    Type: 'Dropdown',
    Sequence: 6,
    IsConnectorAction: true,
    ConnectorCategory: 'Custom Actions',
    RenderAsIcon: false
  },
  {
    Name: 'ba69b416-7a7c-4238-ada5-151601517e21',
    Title: 'Custom Actions - LG Row Action 2',
    Type: 'Dropdown',
    Sequence: 7,
    IsConnectorAction: true,
    ConnectorCategory: 'Custom Actions',
    RenderAsIcon: false
  },
  {
    Name: 'NO_ID',
    Title: 'Custom Actions - LG Row Action 2',
    Type: 'Dropdown',
    Sequence: 7,
    IsConnectorAction: true,
    ConnectorCategory: 'Custom Actions',
    RenderAsIcon: false
  },

  {
    Name: '7b315991-6d21-47fb-b088-8ed759298dbb',
    Title: 'Messaging - Send SMS v3',
    Type: 'Dropdown',
    Sequence: 9,
    IsConnectorAction: true,
    ConnectorCategory: 'Messaging',
    RenderAsIcon: false
  },
  {
    Name: '7b315991-6d21-47fb-b088-8ed759298dbb',
    Title: 'Messaging - Send SMS v3',
    Type: 'NO_RENDER_TYPE',
    Sequence: 9,
    IsConnectorAction: true,
    ConnectorCategory: 'Messaging',
    RenderAsIcon: false
  }
];

const actionSegregationMock = {
  buttonActions: [
    {
      disabled: true,
      id: 'Call',
      renderAsIcon: false,
      sequence: 2,
      title: 'Call',
      toolTip: 'Number is not present',
      type: 'Button'
    },
    {
      id: 'SendEmail',
      renderAsIcon: false,
      sequence: 3,
      subMenu: [
        { disabled: false, label: 'Send Email', value: 'SendEmailAction' },
        { label: 'View Scheduled Email', value: 'ViewScheduledEmail' }
      ],
      title: 'Email',
      type: 'Button'
    },
    {
      icon: '',
      id: 'Processes',
      sequence: 999,
      title: 'Processes',
      type: 'Button',
      workAreaId: workAreaIds.LEAD_DETAILS.ADD_ACTIVITY
    }
  ],
  moreActions: [
    {
      disabled: undefined,
      isLoading: undefined,
      label: 'Send SMS v3',
      subMenu: undefined,
      toolTip: undefined,
      value: '7b315991-6d21-47fb-b088-8ed759298dbb'
    },
    {
      label: 'Custom Actions',
      subMenu: [
        {
          disabled: undefined,
          isLoading: undefined,
          label: 'LG Row Action 1',
          subMenu: undefined,
          toolTip: undefined,
          value: 'db8b126c-a53d-4ebc-a613-0033915d93be'
        },
        {
          disabled: undefined,
          isLoading: undefined,
          label: 'LG Row Action 2',
          subMenu: undefined,
          toolTip: undefined,
          value: 'ba69b416-7a7c-4238-ada5-151601517e21'
        }
      ],
      value: 'Custom Actions'
    }
  ]
};

const settingConfigurationMock = {
  ActivityProcessBtnConfig: '{"displayName":"Processes1","showAfterQuickAdd":true}',
  DisableQuickAddActivityBtn: '1'
};
const fields = {
  PhotoUrl: 'https://example.com/photo.jpg',
  FirstName: 'John',
  LastName: 'Doe',
  EmailAddress: 'john.doe@example.com',
  ProspectStage: 'TestStage'
};
const MOCK_AUGMENTED_ENTITY_DATA: IAugmentedEntity = {
  vcard: {
    body: {
      icon: { content: 'https://example.com/photo.jpg', contentType: IconContentType.Image },
      primarySection: {
        components: [
          {
            type: ComponentType.Title,
            config: { content: 'John Doe' },
            customStyleClass: 'lead_title'
          },
          {
            type: ComponentType.Badge,
            config: { content: 'TestStage' },
            customStyleClass: 'lead_badge'
          },
          {
            type: ComponentType.QuickAction,
            config: [
              LEAD_QUICK_ACTION_CONFIG.leadStar,
              LEAD_QUICK_ACTION_CONFIG.leadShare,
              LEAD_QUICK_ACTION_CONFIG.leadEdit
            ],
            customStyleClass: 'lead_quick_action'
          },
          {
            type: ComponentType.Action,
            config: {
              actions: actionsAugmentationMock,
              settingConfig: settingConfigurationMock,
              featureRestrictionConfigMap: leadFeatureRestrictionConfigMap
            } as IAugmentedAction,
            customStyleClass: 'lead_action'
          }
        ],
        customStyleClass: 'lead_primary_section'
      },
      secondarySection: {
        components: [
          {
            type: ComponentType.MetaData,
            config: []
          }
        ]
      }
    }
  },
  metrics: [],
  properties: {
    entityProperty: [],
    fields,
    entityConfig: {},
    featureRestrictionConfig: {
      moduleName: FeatureRestrictionModuleTypes.LeadDetails,
      actionName: 'Edit Lead',
      callerSource: CallerSource?.LeadDetailsVCard
    }
  },
  tabs: [],
  attributes: { detailsConfiguration: { Sections: [] }, fields: fields, metadata: {} }
};

// const augmentedActionMock =

const MOCK_ENTITY_DATA: ILead = {
  details: {
    Fields: {
      [LEAD_SCHEMA_NAME.PHOTO_URL]: 'https://example.com/photo.jpg',
      [LEAD_SCHEMA_NAME.FIRST_NAME]: 'John',
      [LEAD_SCHEMA_NAME.LAST_NAME]: 'Doe',
      [LEAD_SCHEMA_NAME.EMAIL_ADDRESS]: 'john.doe@example.com',
      [LEAD_SCHEMA_NAME.PROSPECT_STAGE]: 'TestStage'
    },
    VCardConfiguration: { DisplayName: '', Sections: [] },
    ActionsConfiguration: actionConfigurationMock as IActionConfiguration[],
    TabsConfiguration: [],
    LeadDetailsConfiguration: {
      Sections: []
    },
    ConnectorConfiguration: connectorConfigurationMock as unknown as IConnectorConfiguration,
    SettingConfiguration: settingConfigurationMock
  },
  metaData: {}
};

export {
  MOCK_AUGMENTED_ENTITY_DATA,
  MOCK_ENTITY_DATA,
  actionsAugmentationMock,
  settingConfigurationMock,
  actionSegregationMock
};
