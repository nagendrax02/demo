import { getOpportunityDetailsPath } from 'router/utils/entity-details-url-format';
import { IRecordType } from '../smartview-tab/smartview-tab.types';
import styles from './cell-renderer.module.css';
import { useEffect, useState } from 'react';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { getDefaultOppName, handleEntityClick, openInFullScreen } from './utils';
import { EntityType } from 'common/types';
import { getTabData, useActiveTab } from '../smartview-tab/smartview-tab.store';
import { classNames, isVisitedLink } from 'common/utils/helpers/helpers';
import { useLocation } from 'wouter';
import useAppTabsEnabled from 'common/utils/use-app-tabs-enabled';

const OpportunityIdentifier = ({
  record,
  disableFullScreen
}: {
  record: IRecordType;
  disableFullScreen?: boolean;
}): JSX.Element => {
  const { RelatedActivityId, ProspectActivityId, ActivityEvent, showDefaultOppName } = record;
  const id = RelatedActivityId ?? ProspectActivityId;
  const eventCode = ActivityEvent;

  const activeTab = useActiveTab();
  const tabData = getTabData(activeTab);
  const { isAppTabsEnabled } = useAppTabsEnabled();
  const [, setLocation] = useLocation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [oppName, setOppName] = useState<string | null>(record.mx_Custom_1);

  useEffect(() => {
    (async (): Promise<void> => {
      if (showDefaultOppName) {
        const defaultName = await getDefaultOppName(record, ActivityEvent);
        setOppName(defaultName);
      }
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Shimmer height="20px" width="100%" style={{ marginTop: '4px' }} />;
  }

  const getCustomClass = (): string => {
    return openInFullScreen(tabData, activeTab, disableFullScreen) && isVisitedLink(id ?? '')
      ? styles.link_visited
      : '';
  };

  const handleOnClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    const recordId = id ?? '';
    if (openInFullScreen(tabData, activeTab)) {
      e.preventDefault(); // Prevent navigation from executing href
      handleEntityClick({
        entity: EntityType.Opportunity,
        recordId,
        entityTypeCode: eventCode ?? '',
        repName: oppName ?? ''
      });
    } else if (isAppTabsEnabled) {
      e.preventDefault();
      setLocation(getOpportunityDetailsPath(recordId, eventCode ?? ''));
    }
  };

  const getRenderer = (): JSX.Element => {
    return (
      <a
        className={getCustomClass()}
        target={openInFullScreen(tabData, activeTab, disableFullScreen) ? '_blank' : '_self'}
        href={getOpportunityDetailsPath(id ?? '', eventCode ?? '')}
        rel="noopener"
        onClick={handleOnClick}
        title={oppName ?? ''}>
        {oppName}
      </a>
    );
  };

  return (
    <div
      className={classNames('ng_p_1_sb', styles.entity_identifier, styles.opportunity_identifier)}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}>
        {getRenderer()}
      </div>
    </div>
  );
};

OpportunityIdentifier.defaultProps = {
  disableFullScreen: false
};
export default OpportunityIdentifier;
