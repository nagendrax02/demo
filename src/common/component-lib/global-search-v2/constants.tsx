import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';
import { EntityType } from 'common/types';
import {
  ISearchResult,
  IRecentSearchCardLayout,
  EmptyStateType,
  IEmptyStateConfig,
  IDefaultEntityConfig,
  ISearchRecord
} from './global-searchV2.types';
import LeadsIcon from 'assets/custom-icon/LeadsIcon';
import styles from './global-search-v2.module.css';
import StarLeadIcon from 'assets/custom-icon/StarLeadIcon';
import { ACTION } from 'apps/entity-details/constants';
import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import TicketChannelIconRenderer from 'v2/quick-view/augmentation/ticket/components/TicketChannelIconRenderer/TicketChannelIconRenderer';
import { ITicket } from 'v2/quick-view/augmentation/ticket/ticket.types';
import Badge from '@lsq/nextgen-preact/v2/badge';
export const CHAR_TO_START_SEARCHING = 3;
export const MAX_RESULTS_TO_CACHE = 5;
export const LEAD_TYPE_IS_PUBLISHED = '1';
const SearchIcon = withSuspense(lazy(() => import('assets/custom-icon/v2/SearchIcon')));

const NoResultsFoundIcon = withSuspense(lazy(() => import('assets/custom-icon/v2/NoResultsFound')));
const SomethingWentWrongIcon = withSuspense(
  lazy(() => import('assets/custom-icon/SomethingWentWrong'))
);
const DefaultAddEntityForm = withSuspense(
  lazy(() => import('./components/empty-states/DefaultAddEntityForm'))
);

export const EMPTY_STATE_CONFIG: Record<EmptyStateType, IEmptyStateConfig> = {
  [EmptyStateType.FirstSearch]: {
    Icon: () => <SearchIcon />,
    heading: 'Search across Leadsquared.',
    subHeading: 'Filter by your search entity and type to search'
  },
  [EmptyStateType.NoResultsFound]: {
    Icon: () => <NoResultsFoundIcon type="outline" className={styles.no_results_found_icon} />,
    heading: 'No results found!',
    subHeading: 'Try changing the search keyword or the search entity.',
    additionalComponent: <DefaultAddEntityForm />
  },
  [EmptyStateType.AccessDenied]: {
    Icon: () => <NoResultsFoundIcon type="outline" className={styles.no_results_found_icon} />,
    heading: 'Access Denied',
    subHeading: 'You do not have permission to view this content.'
  },
  [EmptyStateType.SomethingWentWrong]: {
    Icon: () => <SomethingWentWrongIcon />,
    heading: 'Something Went Wrong!',
    subHeading: 'Our experts are already working on troubleshooting the issue.'
  }
};

export const defaultConfigMap: Record<EntityType, IDefaultEntityConfig> = {
  [EntityType.Lead]: {
    buttonText: 'Add Lead',
    modalTitle: 'Create New Lead',
    id: ACTION.AddNewLead
  },
  [EntityType.Opportunity]: {
    buttonText: 'Add Opportunity',
    modalTitle: 'Create New Opportunity',
    id: 'opportunityModal'
  },
  [EntityType.Account]: {
    buttonText: 'Add Account',
    modalTitle: 'Create New Account',
    id: 'accountModal'
  },
  [EntityType.Activity]: {
    buttonText: 'Add Activity',
    modalTitle: 'Log New Activity',
    id: 'activityModal'
  },
  [EntityType.Task]: {
    buttonText: 'Add Task',
    modalTitle: 'Create New Task',
    id: 'taskModal'
  },
  [EntityType.AccountActivity]: {
    buttonText: 'Add Account Activity',
    modalTitle: 'Log Account Activity',
    id: 'accountActivityModal'
  },
  [EntityType.Lists]: {
    buttonText: 'Add List',
    modalTitle: 'Create New List',
    id: 'listModal'
  },
  [EntityType.Ticket]: {
    buttonText: 'Add Ticket',
    modalTitle: 'Create New Ticket',
    id: 'ticketModal'
  }
};

export const GlobalSearchEntities = {
  [EntityType.Lead]: {
    value: EntityType.Lead,
    label: 'Leads',
    text: 'Leads',
    entityType: EntityType.Lead,
    leadTypeInternalName: ''
  },
  [EntityType.Ticket]: {
    entityType: EntityType.Ticket,
    value: EntityType.Ticket,
    label: 'Tickets',
    text: 'Tickets'
  }
};

const MAX_VCARD_ACTIONS = 3;

export { MAX_VCARD_ACTIONS };
export const listLength = 25;
export const DEFAULT_PAGE_INDEX = 1;

export const resultsCacheConfig: Record<Partial<EntityType> | string, string> = {
  [EntityType.Lead]: 'ProspectID'
};

export const defaultResults: ISearchResult = {
  TotalRecords: 0,
  Data: [] as unknown as ISearchRecord[]
};

export const alertConfig: Record<string, INotification> = {
  ACCESS_DENIED: {
    type: Type.WARNING,
    message: 'Access Denied. Please contact administrator'
  },
  FETCH_ERROR: {
    type: Type.ERROR,
    message: 'Failed to fetch the details'
  }
};

export const leadLayout: IRecentSearchCardLayout = {
  heading: {
    icon: <LeadsIcon type="filled" className={styles.lead_card_lead_icon} />,
    iconTooltipAttribute: 'LeadTypeName',
    iconTooltipText: 'Lead',
    iconTooltipFallBack: 'Lead',
    value: '',
    tags: [
      {
        id: 1,
        type: 'icon',
        icon: <StarLeadIcon />,
        value: '',
        attribute: 'IsStarredLead'
      },
      {
        id: 2,
        type: 'badge',
        value: '',
        attribute: 'ProspectStage',
        className: styles.tag_lead_text
      }
    ],
    attribute: ['FirstName', 'LastName']
  },
  description: [
    {
      value: '',
      attribute: 'Phone'
    },
    {
      value: '',
      attribute: 'EmailAddress'
    }
  ],
  ownerName: {
    value: '',
    attribute: 'OwnerIdName'
  },
  uniqueIdentifier: 'ProspectID'
};

export const ticketLayout = (entity: ITicket): IRecentSearchCardLayout => {
  return {
    heading: {
      icon: (
        <TicketChannelIconRenderer channel={entity.Channel} customClassName={styles.ticket_icon} />
      ),
      iconTooltipText: '',
      iconTooltipFallBack: 'Ticket',
      iconTooltipAttribute: '',
      value: '',
      tags: [
        {
          id: 1,
          type: 'badge',
          value: '',
          status: 'neutral',
          attribute: 'Status',
          className: styles.tag_lead_text
        }
      ],
      attribute: ['Title']
    },
    description: [
      {
        value: '',
        attribute: 'Key',
        customClassName: '',
        customElement: (
          <Badge size="md" status="neutral">
            {entity.Key}
          </Badge>
        )
      },
      {
        value: '',
        attribute: 'LeadName',
        icon: <LeadsIcon type="outline" className={styles.ticket_lead_icon} />
      }
    ],
    ownerName: {
      value: '',
      attribute: 'Owner'
    },
    uniqueIdentifier: 'Id'
  };
};

export const EntityTypePropertyConfig: Partial<Record<EntityType, string>> = {
  [EntityType.Lead]: 'LeadPropertyList'
};

export const EntityKeyToEntityTypeMap: Record<string, EntityType> = {
  Leads: EntityType.Lead,
  Accounts: EntityType.Account
};
