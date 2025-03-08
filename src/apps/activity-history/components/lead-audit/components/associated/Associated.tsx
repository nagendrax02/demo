/* eslint-disable complexity */
import { CallerSource } from 'src/common/utils/rest-client';
import MetadataInfo from '../../../shared/metadata-info';
import { IComponent } from '../../lead-audit.types';
import styles from '../styles.module.css';
import { parseAccount } from '../utils';
import { EntityType } from 'common/types';
import { useEffect, useState } from 'react';
import { getEntityUrls } from './utils';

const Associated = (props: IComponent): JSX.Element => {
  const { leadRepresentationName, auditData, changedById, type, entityDetailsCoreData } = props;
  const isAccountActivityHistory =
    type === EntityType.Account && entityDetailsCoreData?.entityIds?.account;

  const { OldValue = '', NewValue = '', ChangedBy = '' } = auditData || {};

  const [entityUrls, setEntityUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    (async (): Promise<void> => {
      const response = await getEntityUrls(OldValue, NewValue, type);
      setEntityUrls(response);
    })();
  }, []);

  const getHrefValue = (account: string): string => {
    if (type === EntityType.Account) {
      const leadId = (NewValue ? NewValue : OldValue)?.split?.('}')?.[1];
      return entityUrls?.[leadId];
    } else if (type === EntityType.Lead) {
      const accountId = account?.split?.('{mxseperator}')?.[1];
      return entityUrls?.[accountId];
    }
    return '';
  };

  const getAccountName = (account: string): JSX.Element | string => {
    const { name } = parseAccount(account);
    return name ? (
      <a className={styles.link} href={getHrefValue(account)}>
        {name}
      </a>
    ) : (
      ''
    );
  };

  const leadRepName = leadRepresentationName?.SingularName || 'Lead';

  const renderText = (): JSX.Element => {
    if (!OldValue) {
      return (
        <>
          {isAccountActivityHistory ? (
            <>
              {leadRepName} associated with {getAccountName(NewValue)} added to the{' '}
              {auditData?.CompanyName}
            </>
          ) : (
            <>
              {leadRepName} associated with {getAccountName(NewValue)}
            </>
          )}
        </>
      );
    }
    if (OldValue && NewValue) {
      return (
        <>
          {leadRepName} Account changed from {getAccountName(OldValue)} to{' '}
          {getAccountName(NewValue)}
        </>
      );
    }
    if (OldValue && !NewValue) {
      return (
        <>
          {isAccountActivityHistory ? (
            <>
              {leadRepName} unassociated with {getAccountName(OldValue)} removed from{' '}
              {auditData?.CompanyName}
            </>
          ) : (
            <>
              {leadRepName} unassociated with {getAccountName(OldValue)}.
            </>
          )}
        </>
      );
    }
    if (!OldValue && NewValue) {
      return (
        <>
          {leadRepName} unassociated with {getAccountName(OldValue)}.
        </>
      );
    }
    return <></>;
  };

  return (
    <>
      <div className={styles.text}>{renderText()}</div>
      <MetadataInfo
        byLabel="Changed by:"
        createdByName={ChangedBy}
        createdBy={changedById}
        callerSource={CallerSource.ActivityHistoryLeadAuditActivity}
      />
    </>
  );
};

export default Associated;
