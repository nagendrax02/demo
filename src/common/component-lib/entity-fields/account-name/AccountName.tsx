import styles from './account-name.module.css';
import { MASKED_TEXT, TOOLTIP_CHAR_LIMIT_TEXTAREA } from 'common/constants';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { getAccountDetailsPath } from 'router/utils/entity-details-url-format';
import { lazy, useEffect, useState } from 'react';
import { getAccountCoreData, IAccountCoreData } from 'common/utils/helpers/account';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

export interface IAccountName {
  name: string;
  id: string;
  schemaName?: string;
}

const AccountName = ({ name, id, schemaName }: IAccountName): JSX.Element | null => {
  const [accountData, setAccountData] = useState<IAccountCoreData | undefined>();

  useEffect(() => {
    (async (): Promise<void> => {
      if (['RelatedCompanyId', 'P_RelatedCompanyId'].includes(schemaName || '')) {
        const response = await getAccountCoreData(id);
        setAccountData(response);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!id) return <></>;

  const validAccountName = accountData?.accountName ? accountData?.accountName : name;

  if (name === MASKED_TEXT) {
    return <>{MASKED_TEXT}</>;
  }

  const getContext = (): JSX.Element => {
    return (
      <a
        className={styles.styled_link}
        href={getAccountDetailsPath(
          accountData?.accountTypeName || '',
          id,
          accountData?.accountTypeId || ''
        )}
        target="_self">
        {validAccountName?.length > TOOLTIP_CHAR_LIMIT_TEXTAREA
          ? `${validAccountName.substring(0, TOOLTIP_CHAR_LIMIT_TEXTAREA)}...`
          : validAccountName}
      </a>
    );
  };

  return (
    <>
      {validAccountName?.length > TOOLTIP_CHAR_LIMIT_TEXTAREA ? (
        <Tooltip
          content={validAccountName}
          placement={Placement.Vertical}
          trigger={[Trigger.Hover]}
          wrapperClass={styles.tooltip_wrapper}>
          {getContext()}
        </Tooltip>
      ) : (
        getContext()
      )}
    </>
  );
};

AccountName.defaultProps = {
  schemaName: ''
};

export default AccountName;
