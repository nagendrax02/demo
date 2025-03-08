import {
  ComponentType,
  IQuickViewCard,
  ITabConfig,
  IVCardConfig
} from '@lsq/nextgen-preact/quick-view/quick-view.types';
import { IGetAugmentedData } from '../augmentation.types';
import QuickViewPropertiesTab from '../lead/components/quick-view-properties-tab';
import EntityDetailsAccordion from '../components/entity-details-accordian/EntityDetailsAccordian';
import EntityProperties from '../components/entity-properties/EntityProperties';
import { ITicket } from './ticket.types';
import styles from './ticket.module.css';
import { updateProperties } from '../../utils';
import Badge from '@lsq/nextgen-preact/v2/badge';
import { LeadIcon } from 'assets/custom-icon/v2';
import { classNames, openLeadDetailTab } from 'common/utils/helpers/helpers';
import TicketVcardProperties from './components/TicketVcardProperties/TicketVcardProperties';
import { TicketProperties } from './constants';
import TicketVcardFooter from './components/TicketVcardFooter';
import TicketChannelIconRenderer from './components/TicketChannelIconRenderer/TicketChannelIconRenderer';

export const redirectionHandler = (entityId: string): void => {
  openLeadDetailTab(entityId, true);
};
export const getQuickViewCardConfig = (ticket: ITicket): IQuickViewCard => {
  const vCard: IVCardConfig = {
    Icon: {
      icon: (
        <div className={styles.icon}>
          <TicketChannelIconRenderer channel={ticket?.Channel} />
        </div>
      )
    },
    Header: {
      children: <TicketVcardProperties ticket={ticket} />
    },
    Body: {
      components: [
        {
          type: ComponentType.Title,
          data: { content: ticket?.Title || '' }
        },
        {
          type: ComponentType.Custom,
          data: (
            <button
              className="unstyle_button"
              onClick={() => {
                redirectionHandler(ticket?.LeadId);
              }}>
              <Badge size={'md'} status="neutral" type="regular">
                <div className={classNames(styles.lead_identifier_content)}>
                  <LeadIcon className={styles.ticket_lead_icon} type={'outline'} />
                  <span className={classNames('lead-identifier-name', styles.lead_name)}>
                    {ticket?.LeadName}
                  </span>
                </div>
              </Badge>
            </button>
          )
        }
      ]
    },
    Footer: (
      <TicketVcardFooter status={ticket?.Status} resolutionTime={ticket?.ResolutionTime ?? 'NA'} />
    )
  };
  const properties = updateProperties(TicketProperties, ticket);
  const tab: ITabConfig = {
    id: 'ticket',
    title: 'Ticket Properties',
    content: (
      <QuickViewPropertiesTab
        properties={
          <div className={styles.properties}>
            <EntityDetailsAccordion propertiesHeading={'Ticket Properties'}>
              <EntityProperties properties={properties} fields={{}} />
            </EntityDetailsAccordion>
          </div>
        }
      />
    )
  };
  return {
    vcardConfig: vCard,
    tabs: [tab],
    showPlaceHolder: false
  };
};

export const getTicketAugmentedData = async (data: IGetAugmentedData): Promise<IQuickViewCard> => {
  const { entityRecord: ticket } = data;

  return getQuickViewCardConfig((ticket as ITicket) ?? {});
};
