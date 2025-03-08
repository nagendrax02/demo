import HelpIcon from 'assets/custom-icon/v2/Help';
import styles from './actions.module.css';
import { classNames } from 'common/utils/helpers';
import { INavigationItem } from '../app-header.types';

interface IHelpProps {
  config: INavigationItem;
}

const Help = ({ config }: IHelpProps): JSX.Element => {
  return (
    <a
      href={config?.Path ?? ''}
      target="_blank"
      className={classNames(styles.action_button, styles.help_button_icon)}
      rel="noopener"
      title="Help">
      <HelpIcon type="outline" />
    </a>
  );
};

export default Help;
