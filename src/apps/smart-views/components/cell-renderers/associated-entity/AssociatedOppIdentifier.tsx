import { ReactNode } from 'react';
import { IRecordType, ITabConfig } from '../../smartview-tab/smartview-tab.types';
import { Opportunity } from 'assets/custom-icon/v2';
import { getTabData, useActiveTab } from '../../smartview-tab/smartview-tab.store';
import cellStyles from '../cell-renderer.module.css';
import styles from './associated-entity.module.css';
import { classNames, isVisitedLink } from 'common/utils/helpers/helpers';
import { EntityType } from 'common/types';
import { getOpportunityDetailsPath } from 'router/utils/entity-details-url-format';
import { getAssociatedOppName, handleEntityClick, openInFullScreen } from '../utils';
import { useLocation } from 'wouter';
import Badge from '@lsq/nextgen-preact/v2/badge';
import { BadgeSize } from '@lsq/nextgen-preact/v2/badge/badge.types';
import useAppTabsEnabled from 'common/utils/use-app-tabs-enabled';

const getAnchorTarget = (
  tabData: ITabConfig,
  activeTab: string,
  disableFullScreen?: boolean
): string => {
  return openInFullScreen(tabData, activeTab, disableFullScreen) ? '_blank' : '_self';
};

const getVisitedLinkStyle = (id: string): string => {
  return isVisitedLink(id) ? styles.visited_badge : '';
};

const AssociatedOppIdentifier = ({
  record,
  disableFullScreen,
  badgeSize
}: {
  record: IRecordType;
  disableFullScreen?: boolean;
  badgeSize?: BadgeSize;
}): ReactNode => {
  const associateOpportunityName = getAssociatedOppName(record);
  const activeTab = useActiveTab();
  const tabData = getTabData(activeTab);
  const [, setLocation] = useLocation();
  const { isAppTabsEnabled } = useAppTabsEnabled();

  const oppId = record?.RelatedActivityId ?? record?.ProspectActivityId ?? '';
  const eventCode = record?.RelatedActivityEvent ?? record?.O_ActivityEvent ?? '';

  // eslint-disable-next-line complexity
  const onClick = (e): void => {
    if (!associateOpportunityName) return;

    if (openInFullScreen(tabData, activeTab, disableFullScreen)) {
      e.preventDefault(); // Prevent navigation from executing href
      handleEntityClick({
        entity: EntityType.Opportunity,
        recordId: oppId,
        entityTypeCode: eventCode,
        repName: associateOpportunityName
      });
    } else if (isAppTabsEnabled) {
      e.preventDefault();
      setLocation(getOpportunityDetailsPath(oppId, eventCode));
    }
  };
  return associateOpportunityName ? (
    <div
      className={classNames(
        'ng_p_1_sb',
        styles.associated_entity_name,
        cellStyles.identifier_container
      )}
      onClick={onClick}>
      <a
        target={getAnchorTarget(tabData, activeTab, disableFullScreen)}
        title={associateOpportunityName}
        href={getOpportunityDetailsPath(oppId, eventCode)}
        rel="noopener"
        className={getVisitedLinkStyle(oppId)}
        onClick={() => {}}>
        <Badge
          size={badgeSize ?? 'sm'}
          status="neutral"
          type="regular"
          customStyleClass={styles.opportunity_icon_container}>
          <Opportunity type="outline" />
          <div className={styles.opportunity_name}>{associateOpportunityName}</div>
        </Badge>
      </a>
    </div>
  ) : null;
};

AssociatedOppIdentifier.defaultProps = {
  disableFullScreen: false,
  badgeSize: 'sm'
};

export default AssociatedOppIdentifier;
