import { trackError } from 'common/utils/experience/utils/track-error';
import { IRecordType } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { useEffect, useRef, useState } from 'react';
import styles from './row-detail.module.css';
import {
  IAugmentedAttributeFields,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { fetchActivityDetails } from 'common/component-lib/activity-table/utils/config/data-fetcher';
import { CallerSource } from 'common/utils/rest-client';
require('../../../../entity-details/vcard-styles/vcard-styles.module.css');
import {
  fetchEntityMetaData,
  getAugmentedAttributeFields,
  getLeadVcardInfo,
  getWidthFromParentGrid
} from './utils';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import Content from 'apps/entity-attribute-details/components/content';
import Body from 'apps/entity-details/components/vcard/sections/Body';
import { EntityType } from 'common/types';
import { DEFAULT_ENTITY_REP_NAMES, DEFAULT_ENTITY_IDS } from 'common/constants';
import { getLeadRepresentationName } from 'apps/smart-views/smartviews-store';

const RowDetail = ({
  item,
  entityType,
  tabId
}: {
  item: IRecordType;
  entityType?: EntityType;
  tabId?: string;
}): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<IAugmentedAttributeFields[]>([]);
  const heading = useRef('');

  const vcardData = getLeadVcardInfo(item);

  const prospectId = item.ProspectId || '';

  const getLeadRepName = (): IEntityRepresentationName => {
    return getLeadRepresentationName() || DEFAULT_ENTITY_REP_NAMES.lead;
  };

  useEffect(() => {
    setLoading(true);
    (async (): Promise<void> => {
      try {
        const [entityData, entityMetadata] = await Promise.all([
          fetchActivityDetails(item.id, CallerSource.SmartViews),
          fetchEntityMetaData({ entityType, item })
        ]);
        heading.current = `${entityMetadata.DisplayName} Details`;
        if (entityData) {
          const augmentedData = getAugmentedAttributeFields({
            activityDetails: {
              ...entityData,
              activityId: item.id,
              leadId: prospectId
            },
            activityMetaData: entityMetadata
          });
          setDetail(augmentedData);
        }
      } catch (err) {
        trackError(err);
      }
      setLoading(false);
    })();
  }, [item, entityType]);

  const getShimmer = (): JSX.Element => {
    return (
      <div>
        {Array.from({ length: 3 }, (val, index) => (
          <div key={index} className={styles.shimmer_wrapper}>
            <Shimmer width="45%" height="25px" className="shimmer" />
            <Shimmer width="45%" height="25px" className="shimmer" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        className={styles.details_wrapper}
        style={{
          width: getWidthFromParentGrid(tabId || '')
        }}>
        <div className={styles.vcard_container}>
          <Body
            coreData={{
              entityDetailsType: EntityType.Lead,
              entityIds: {
                ...DEFAULT_ENTITY_IDS,
                [EntityType.Lead]: prospectId
              },
              entityName: item.LeadName ?? '',
              entityRepNames: {
                ...DEFAULT_ENTITY_REP_NAMES,
                lead: getLeadRepName()
              }
            }}
            fieldValues={item as Record<string, string>}
            config={vcardData}
            isLoading={false}
          />
        </div>
        <div className={styles.activity_details_wrapper}>
          <div className={styles.heading}>{heading.current}</div>
          {!detail.length && !loading ? (
            <div className={styles.no_details}>Details not found!!</div>
          ) : null}
          {!loading ? <Content fields={detail} /> : getShimmer()}
        </div>
      </div>
    </>
  );
};

RowDetail.defaultProps = {
  entityType: EntityType.Activity
};

export default RowDetail;
