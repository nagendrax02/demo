import { HeaderAction } from 'apps/smart-views/constants/constants';

interface IHeaderConfig {
  title: string;
  subtitle?: string;
}

interface ILeftPanelConfig {
  title?: string;
  manageFieldsTitle?: string;
}

interface IRightPanelConfig {
  title: string;
  subtitle?: string;
  warningMessage?: string;
}

interface ITabSettingsConfig {
  Header: IHeaderConfig;
  LeftPanel: ILeftPanelConfig;
  RightPanel?: IRightPanelConfig;
}

const MAX_ALLOWED_PLACEHOLDER = '{{MAX_ALLOWED}}';
const ENTITY_DISPLAY_NAME = '{{ENTITY_NAME}}';

const TAB_SETTING_CONFIG = {
  [HeaderAction.SelectColumns]: {
    Header: {
      title: 'Manage Columns'
    },
    LeftPanel: {
      title: 'Select {{EntityName}} Columns',
      manageFieldsTitle: 'MANAGE LEADS FIELDS'
    },
    RightPanel: {
      title: 'Reorder Selected Columns'
    }
  },
  [HeaderAction.ManageFilters]: {
    Header: {
      title: 'Configure Filter Fields'
    },
    LeftPanel: {
      manageFieldsTitle: 'MANAGE LEADS FIELDS'
    }
  },
  [HeaderAction.ExportLeads]: {
    Header: {
      title: `Export ${ENTITY_DISPLAY_NAME}`,
      subtitle: ''
    },
    LeftPanel: {
      title: 'Available Fields',
      manageFieldsTitle: 'LEADS FIELDS'
    },
    RightPanel: {
      title: 'Selected Fields',
      subtitle: 'Drag to reorder.',
      warningMessage: ''
    }
  }
};

export { TAB_SETTING_CONFIG, MAX_ALLOWED_PLACEHOLDER, ENTITY_DISPLAY_NAME };

export type { ITabSettingsConfig, IHeaderConfig, ILeftPanelConfig, IRightPanelConfig };
