/* eslint-disable complexity */
import { getEntityId } from 'common/utils/helpers';
import { isSmartviewTab } from '../../utils/utils';
import { getTabData, useActiveTab, useTabType } from '../smartview-tab/smartview-tab.store';
import { IRecordType, ITabConfig } from '../smartview-tab/smartview-tab.types';
import styles from './cell-renderer.module.css';
import associatedEntityStyle from './associated-entity/associated-entity.module.css';
import {
  classNames,
  getAccountId,
  getLeadName,
  isValidGUID,
  isVisitedLink
} from 'common/utils/helpers/helpers';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { EntityType, Theme } from 'common/types';
import { getLeadDetailsPath } from 'router/utils/entity-details-url-format';
import LeadStar from '../lead-star';
import { getAssociatedLeadId, handleEntityClick, openInFullScreen } from './utils';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { Lead } from 'assets/custom-icon/v2';
import Badge from '@lsq/nextgen-preact/v2/badge';
import { BadgeSize } from '@lsq/nextgen-preact/v2/badge/badge.types';
import useAppTabsEnabled from 'common/utils/use-app-tabs-enabled';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const getCustomClass = ({
  id,
  activeTab,
  disableFullScreen,
  tabData,
  isAssociatedEntity
}: {
  id: string;
  tabData: ITabConfig;
  activeTab: string;
  disableFullScreen?: boolean;
  isAssociatedEntity?: boolean;
}): string => {
  if (openInFullScreen(tabData, activeTab, disableFullScreen) && isVisitedLink(id)) {
    return isAssociatedEntity ? associatedEntityStyle.visited_badge : styles.link_visited;
  }
  return '';
};

const LeadName = ({
  isAssociatedEntity,
  leadName,
  badgeSize
}: {
  leadName: string;
  isAssociatedEntity: boolean;
  badgeSize: BadgeSize;
}): ReactNode => {
  if (isAssociatedEntity) {
    return (
      <Badge size={badgeSize ?? 'sm'} status="neutral" type="regular">
        <div className={classNames(styles.lead_identifier_content)}>
          <Lead className="lead_identifier_icon" type={'outline'} />
          <span className={classNames('lead-identifier-name', styles.lead_name)}>{leadName}</span>
        </div>
      </Badge>
    );
  }

  return leadName;
};

export const LeadIdentifier = ({
  record,
  disableFullScreen,
  customStyle,
  isAssociatedEntity,
  badgeSize
}: {
  record: IRecordType;
  disableFullScreen?: boolean;
  showLeadIcon?: boolean;
  isAssociatedEntity?: boolean;
  customStyle?: string;
  badgeSize?: BadgeSize;
}): ReactNode => {
  const activeTab = useActiveTab();
  const tabData = getTabData(activeTab);
  const tabType = useTabType();
  const [, setLocation] = useLocation();
  const { isAppTabsEnabled } = useAppTabsEnabled();
  const leadTypeConfigOfTab = tabData?.leadTypeConfiguration;

  // PCG_ -> Primary Lead Data in Account Tab
  const updatedLead: Record<string, string | null> = {
    ...record,
    leadId: getAssociatedLeadId(record),
    EmailAddress: record?.PCG_EmailAddress || record?.EmailAddress || record?.P_EmailAddress,
    FirstName: record?.FirstName || record?.PCG_FirstName || record?.RelatedEntityIdName,
    LastName: record?.LastName || record?.PCG_LastName
  };

  const showIsPrimaryContact =
    !isSmartviewTab(activeTab) &&
    parseInt(record.IsPrimaryContact || '') &&
    (getEntityId() || getAccountId());

  const isLeadTab = tabType === EntityType.Lead;

  return isValidGUID(updatedLead.leadId || '') ? (
    <div className={classNames('ng_p_1_sb', styles.identifier_container, customStyle)}>
      {isLeadTab ? (
        <LeadStar
          record={record}
          leadId={updatedLead.leadId ?? ''}
          leadTypeInternalName={leadTypeConfigOfTab?.[0]?.LeadTypeInternalName}
        />
      ) : null}
      <div
        className={styles.entity_identifier}
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <a
          className={getCustomClass({
            id: updatedLead.leadId ?? '',
            activeTab,
            disableFullScreen,
            tabData,
            isAssociatedEntity
          })}
          target={openInFullScreen(tabData, activeTab, disableFullScreen) ? '_blank' : '_self'}
          title={getLeadName(updatedLead)}
          href={getLeadDetailsPath(updatedLead.leadId ?? '')}
          rel="noopener"
          onClick={(e) => {
            if (openInFullScreen(tabData, activeTab, disableFullScreen)) {
              e.preventDefault(); // Prevent navigation from executing href
              handleEntityClick({
                entity: EntityType.Lead,
                recordId: updatedLead.leadId ?? '',
                repName: getLeadName(updatedLead)
              });
            } else if (isAppTabsEnabled) {
              e.preventDefault();
              setLocation(getLeadDetailsPath(updatedLead.leadId ?? ''));
            }
          }}>
          <LeadName
            isAssociatedEntity={isAssociatedEntity ?? false}
            leadName={getLeadName(updatedLead)}
            badgeSize={badgeSize ?? 'sm'}
          />
        </a>
        {showIsPrimaryContact ? (
          <Tooltip
            content={'Primary Contact'}
            theme={Theme.Dark}
            placement={Placement.Vertical}
            trigger={[Trigger.Hover, Trigger.Click]}>
            <Icon
              name="contact_phone"
              variant={IconVariant.Filled}
              customStyleClass={styles.primary_contact}
            />
          </Tooltip>
        ) : null}
      </div>
    </div>
  ) : null;
};

LeadIdentifier.defaultProps = {
  disableFullScreen: false,
  showLeadIcon: false,
  customStyle: '',
  isAssociatedEntity: false,
  badgeSize: 'sm'
};
