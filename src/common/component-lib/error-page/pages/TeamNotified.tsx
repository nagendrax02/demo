import { ErrorInClouds } from 'assets/illustrations';
import ErrorPage from '../ErrorPage';
import styles from './pages.module.css';
import { IPage } from '../error-page.types';
import { isDarkMode } from 'common/utils/helpers/helpers';
import { getMailBodyMessage, getMailSubjectMessage } from '../utils';

interface ITeamNotified extends IPage {
  componentStack?: string;
}

const TeamNotified = ({ variant, componentStack }: ITeamNotified): JSX.Element => {
  return (
    <ErrorPage
      variant={variant}
      icon={<ErrorInClouds className={styles.icon} isDarkMode={isDarkMode()} />}
      title="Our team has been notified.">
      <>
        <div className={styles.team_notified_description}>
          {'We’re working on it and expect to resolve it soon.'}
        </div>
        <div className={styles.team_notified_description}>
          {'If the problem persists, please contact us at '}
          <a
            href={`mailto:support@leadsquared.com?subject=${getMailSubjectMessage()}&body=${getMailBodyMessage(
              componentStack
            )}`}
            className={styles.link}>
            support@leadsquared.com
          </a>
          {'.'}
        </div>
      </>
    </ErrorPage>
  );
};

TeamNotified.defaultProps = {
  componentStack: undefined
};

export default TeamNotified;
