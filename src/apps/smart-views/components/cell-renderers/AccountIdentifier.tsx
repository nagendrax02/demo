import { useEffect, useState } from 'react';
import { IRecordType, ITabConfig } from '../smartview-tab/smartview-tab.types';
import styles from './cell-renderer.module.css';
import { fetchRepresentationName } from 'common/utils/entity-data-manager/account/metadata';
import { CallerSource } from 'common/utils/rest-client';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { getAccountDetailsPath } from 'router/utils/entity-details-url-format';
import { getTabData, useActiveTab } from '../smartview-tab/smartview-tab.store';
import { classNames } from 'common/utils/helpers/helpers';
import { useLocation } from 'wouter';
import useAppTabsEnabled from 'common/utils/use-app-tabs-enabled';

const getEntityCode = (tabData: ITabConfig): string | undefined => {
  return tabData?.relatedEntityCode ?? tabData?.entityCode;
};

const getCompanyName = (companyName: string): string => {
  return companyName ?? '[No Name]';
};

export const AccountIdentifier = ({ record }: { record: IRecordType }): JSX.Element => {
  const [accountRepName, setAccountRepName] = useState<IEntityRepresentationName>({
    SingularName: '',
    PluralName: ''
  });

  const accountName = getCompanyName(record.CompanyName || record.C_CompanyName || '');
  const activeTab = useActiveTab();
  const tabEntityCode = getEntityCode(getTabData(activeTab));
  const { isAppTabsEnabled } = useAppTabsEnabled();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const entityCode = record.C_Entity ?? record.entityCode;
    if (entityCode) {
      fetchRepresentationName(CallerSource.SmartViews, entityCode).then((accRepName) => {
        if (accRepName) setAccountRepName(accRepName);
      });
    }
  }, [record.entityCode, record.C_Entity]);

  const handleOnClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    if (isAppTabsEnabled) {
      e.preventDefault();
      setLocation(
        getAccountDetailsPath(
          accountRepName.SingularName,
          record.CompanyId ?? record?.RelatedCompanyId ?? '',
          tabEntityCode ?? record?.CompanyAutoId ?? ''
        )
      );
    }
  };

  return (
    <div className={classNames('ng_p_1_sb', styles.entity_identifier, styles.account_identifier)}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <a
          title={accountName}
          href={getAccountDetailsPath(
            accountRepName.SingularName,
            record.CompanyId || record?.RelatedCompanyId || '',
            tabEntityCode || record?.CompanyAutoId || ''
          )}
          onClick={handleOnClick}>
          {accountName}
        </a>
      </div>
    </div>
  );
};
