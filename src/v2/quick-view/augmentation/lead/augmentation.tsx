import { EntityType, ILead } from 'common/types';
import styles from './lead.module.css';
import { getAugmentedLeadProperty } from 'apps/entity-details/utils/augment-entity-data/lead/properties';
import { getAugmentedMetricDetails } from 'apps/entity-details/utils/augment-entity-data/lead/metric-details';
import {
  IEntityRepresentationName,
  IMetricsConfig
} from 'apps/entity-details/types/entity-data.types';
import { getAugmentedTitle } from 'apps/entity-details/utils/augment-entity-data/lead/vcard-title';
import StarLeadIcon from 'assets/custom-icon/StarLeadIcon';
import { openLeadDetailTab } from 'common/utils/helpers';
import {
  ComponentType,
  IQuickViewCard,
  ITabConfig,
  IVCardConfig
} from '@lsq/nextgen-preact/quick-view/quick-view.types';
import EntityProperties from 'v2/quick-view/augmentation/components/entity-properties/EntityProperties';
import EntityDetailsAccordion from 'v2/quick-view/augmentation/components/entity-details-accordian/EntityDetailsAccordian';
import LeadActions from './LeadActions';
import QuickViewPropertiesTab from './components/quick-view-properties-tab';
import { IGetAugmentedData } from '../augmentation.types';
import { fetchData } from 'common/utils/entity-data-manager/lead/lead';
import Navigation from '../components/quick-view-actions/Navigation';
import { classNames } from 'common/utils/helpers/helpers';
import { getAugmentedIcon } from 'apps/entity-details/utils/augment-entity-data/lead/vcard-icon';
import { CallerSource } from 'common/utils/rest-client';
import { fetchRepresentationName } from 'common/utils/entity-data-manager/lead/metadata';

export const redirectionHandler = (entityId: string): void => {
  openLeadDetailTab(entityId, true);
};

const fetchLeadRepName = async (): Promise<IEntityRepresentationName | undefined> => {
  const leadRepName = await fetchRepresentationName?.(CallerSource.SmartViews, '');
  return leadRepName;
};

const getVcardBodyComponentData = (
  noNamePresent: boolean,
  lead: ILead
): IQuickViewCard['vcardConfig']['Body'] => {
  return {
    components: [
      {
        type: !noNamePresent ? ComponentType.Title : ComponentType.Custom,
        data: !noNamePresent ? (
          getAugmentedTitle(lead)
        ) : (
          <span className={classNames('ng_h_4_b', styles.disabled)}>No Name</span>
        )
      }
    ]
  };
};
export const getQuickViewCardConfig = async (
  lead: ILead,
  leadId: string,
  setRefreshQuickView?: (value: string) => void
): Promise<IQuickViewCard> => {
  const { details, metaData } = lead;
  const noNamePresent = !getAugmentedTitle(lead)?.content.trim();
  const isStarredLead = details?.Fields?.IsStarredLead === 'true';
  const vCard: IVCardConfig = {
    Icon: {
      icon: (
        <div
          className={classNames(
            styles.avatar_text,
            'ng_h_4_b',
            noNamePresent ? styles.disabled : ''
          )}>
          {!noNamePresent ? getAugmentedIcon(lead)?.content : '-'}
        </div>
      ),
      subIcon: isStarredLead ? <StarLeadIcon /> : undefined
    },

    Body: getVcardBodyComponentData(noNamePresent, lead),
    Footer: (
      <LeadActions
        entityData={lead}
        metadata={metaData}
        isLoading={false}
        entityType={EntityType.Lead}
        entityId={leadId}
        metadataKey={'LeadRepresentationConfig'}
        setRefreshQuickView={setRefreshQuickView}
      />
    )
  };
  const metrics: IMetricsConfig[] = getAugmentedMetricDetails(lead);
  const properties = getAugmentedLeadProperty(lead);
  const leadRepName = await fetchLeadRepName();
  const tab: ITabConfig = {
    id: 'lead',
    title: leadRepName?.SingularName
      ? `${leadRepName?.SingularName} Properties`
      : 'Lead properties',
    content: (
      <QuickViewPropertiesTab
        metricData={metrics}
        properties={
          <div className={styles.properties}>
            <EntityDetailsAccordion
              propertiesHeading={
                leadRepName?.SingularName
                  ? `${leadRepName?.SingularName} Properties`
                  : 'Lead properties'
              }>
              <EntityProperties
                properties={properties?.entityProperty}
                fields={properties?.fields}
              />
            </EntityDetailsAccordion>
          </div>
        }
      />
    )
  };
  return {
    vcardConfig: vCard,
    tabs: [tab],
    quickViewActions: [
      <Navigation
        key={leadId}
        onClick={() => {
          redirectionHandler(leadId);
        }}
      />
    ],
    showPlaceHolder: false
  };
};

export const getleadAugmentedData = async (data: IGetAugmentedData): Promise<IQuickViewCard> => {
  const { entityId, setRefreshQuickView } = data;
  if (!entityId) {
    throw new Error('No valid Lead ID and Lead Type ID found');
  }
  const lead = await fetchData(entityId);

  return getQuickViewCardConfig(lead, entityId, setRefreshQuickView);
};
