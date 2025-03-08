import { MASKED_TEXT } from 'common/constants';
import styles from './link.module.css';
import { getUrl } from './utils';
import { isMiP } from 'common/utils/helpers';
import { classNames } from 'common/utils/helpers/helpers';

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
      return (
        <div className={styles.ellipsis_text} title={link}>
          {link}
        </div>
      );
    }
    return (
      <a
        title={link}
        className={classNames(styles.ellipsis_text, styles.styled_link)}
        onClick={onClick}
        href={getValidLink()}
        target="_self">
        {link}
      </a>
    );
  };

  return linkContent();
};

Link.defaultProps = {
  click: undefined,
  schemaName: ''
};
export default Link;
