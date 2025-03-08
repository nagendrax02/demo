import { trackError } from 'common/utils/experience/utils/track-error';
import { IRecordType } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';
import { CallerSource } from 'common/utils/rest-client';
import { fetchActivityDetails, getAugmentedAttributeFields, getVCardInfo } from './utils';
import Content from 'apps/entity-attribute-details/components/content';
import Body from 'apps/entity-details/components/vcard/sections/Body';
import { EntityType } from 'common/types';
require('../../../../entity-details/vcard-styles/vcard-styles.module.css');
import { DEFAULT_ENTITY_REP_NAMES, DEFAULT_ENTITY_IDS } from 'common/constants';
import { fetchActivityMetadata } from '../meta-data/account-activity';
import { getTabData } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { IActivityDetails } from 'common/component-lib/activity-table/utils/config/data-fetcher';
import ExpandableRow from 'apps/smart-views/components/cell-renderers/row-details/ExpandableRow';

const ActivityExpandableRow = ({
  item,
  tabId
}: {
  item: IRecordType;
  tabId: string;
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<IAugmentedAttributeFields[]>([]);
  const heading = useRef('');

  const vcardData = useMemo(() => {
    return getVCardInfo(item);
  }, [item]);

  useEffect(() => {
    setIsLoading(true);
    (async (): Promise<void> => {
      try {
        const tabConfig = getTabData(tabId);
        const [activityDetails, activityMetaData] = await Promise.all([
          fetchActivityDetails(item.id),
          fetchActivityMetadata(tabConfig.entityCode || '', CallerSource.SmartViews)
        ]);
        heading.current = `${activityMetaData.representationName?.SingularName} Details`;
        if (activityDetails) {
          const augmentedData = getAugmentedAttributeFields(
            activityDetails as IActivityDetails & { CompanyActivityId: string },
            activityMetaData.metaDataMap,
            tabId
          );
          setDetail(augmentedData);
        }
      } catch (err) {
        trackError(err);
        heading.current = `${getTabData(tabId)?.representationName?.SingularName} Details`;
      }
      setIsLoading(false);
    })();
  }, [item, tabId]);

  const getContent = (): JSX.Element | null =>
    detail?.length ? <Content fields={detail} /> : null;

  const getBody = (): JSX.Element => (
    <Body
      coreData={{
        entityDetailsType: EntityType.Account,
        entityIds: DEFAULT_ENTITY_IDS,
        entityRepNames: DEFAULT_ENTITY_REP_NAMES
      }}
      fieldValues={item as Record<string, string>}
      config={vcardData}
      isLoading={false}
    />
  );
  return (
    <ExpandableRow
      getContent={getContent}
      detailsTitle={heading.current}
      tabId={tabId}
      isLoading={isLoading}
      getBody={getBody}
      fallbackText={'No activity details found'}
    />
  );
};

export default ActivityExpandableRow;
