import { trackError } from 'common/utils/experience/utils/track-error';
import Icon from '@lsq/nextgen-preact/icon';
import styles from './automation.module.css';
import { IReportCols } from './automation.types';
import { Module } from 'common/utils/rest-client';
import { getRequestUrl } from 'common/utils/rest-client/utils/rest-client-utils';

interface IAction {
  record: IReportCols;
}

const Action = (props: IAction): JSX.Element => {
  const { record } = props;

  const handleClick = (): void => {
    try {
      const path = `${getRequestUrl(Module.PlatformBase)}Automation/ReportAutomation?${
        record.securedParams || ''
      }`;
      window.open(path, '_blank');
    } catch (error) {
      trackError(error);
    }
  };

  return (
    <div className={styles.action_container} onClick={handleClick}>
      <Icon name="open_in_new" customStyleClass={styles.custom_icon_style} />
      <div>View</div>
    </div>
  );
};

export default Action;
