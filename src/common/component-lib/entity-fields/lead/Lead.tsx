import { HYPHEN, NO_NAME } from 'common/constants';
import styles from './lead.module.css';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { getLeadDetailsPath } from 'router/utils/entity-details-url-format';

export interface ILead {
  leadId: string;
  name?: string;
  displayValue?: string;
  showIcon?: boolean;
  customIconName?: string;
  swapIconPosition?: boolean;
  openInNewTab?: boolean;
}

const Lead = (props: ILead): JSX.Element | null => {
  const { leadId, name, showIcon, displayValue, customIconName, swapIconPosition, openInNewTab } =
    props;

  if (!leadId) {
    return null;
  }

  const getName = (): string => {
    if (name === HYPHEN) {
      return NO_NAME;
    }
    return displayValue || name || 'Click to View';
  };

  const getLinkElement = (): JSX.Element => {
    return (
      <a
        className={styles.link}
        href={getLeadDetailsPath(leadId)}
        tabIndex={0}
        aria-label={name}
        target={openInNewTab ? '_blank' : '_self'}
        rel="noopener">
        {getName()}
      </a>
    );
  };

  return (
    <div className={styles.wrapper}>
      {swapIconPosition ? getLinkElement() : null}
      {showIcon ? (
        <Icon
          name={customIconName ? customIconName : 'person'}
          variant={IconVariant.Filled}
          customStyleClass={styles.icon}
        />
      ) : null}
      {!swapIconPosition ? getLinkElement() : null}
    </div>
  );
};

Lead.defaultProps = {
  name: '',
  displayValue: '',
  showIcon: false
};

export default Lead;
