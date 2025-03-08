import { MASKED_TEXT, TOOLTIP_CHAR_LIMIT } from 'common/constants';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import styles from './link.module.css';
import { getUrl } from './utils';
import { isMiP } from 'common/utils/helpers';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

export interface ILink {
  link: string;
  click?: () => void;
  schemaName?: string;
}

const ACCOUNT_TYPE_SCHEMA_NAMES = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  P_CompanyTypeName: true,
  CompanyTypeName: true
};

const Link = (props: ILink): JSX.Element => {
  const { link, click, schemaName } = props;

  const validSchemaName: string = schemaName || '';

  const onClick = (): void => {
    if (click) {
      click();
    }
  };

  const getValidLink = (): string => {
    if (ACCOUNT_TYPE_SCHEMA_NAMES?.[validSchemaName]) {
      return `/AccountManagement/${link}`;
    }
    return getUrl(link);
  };

  const renderAsPlainText = (): boolean => {
    if (!isMiP() && ACCOUNT_TYPE_SCHEMA_NAMES?.[validSchemaName]) return true;
    return false;
  };

  if (link === MASKED_TEXT) {
    return <>{MASKED_TEXT}</>;
  }

  const linkContent = (): JSX.Element => {
    if (renderAsPlainText()) {
      return <div className={`two-lines-ellipsis`}>{link}</div>;
    }
    return (
      <a
        className={`${styles.styled_link} two-lines-ellipsis`}
        onClick={onClick}
        href={getValidLink()}
        target="_self">
        {link}
      </a>
    );
  };

  return (
    <>
      {link?.length > TOOLTIP_CHAR_LIMIT ? (
        <Tooltip content={link} placement={Placement.Vertical} trigger={[Trigger.Hover]}>
          {linkContent()}
        </Tooltip>
      ) : (
        linkContent()
      )}
    </>
  );
};

Link.defaultProps = {
  click: undefined,
  schemaName: ''
};
export default Link;
