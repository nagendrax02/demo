import { classNames } from 'common/utils/helpers/helpers';
import styles from './modules.module.css';

/**
 * Displays a pointer to indicate the currently selected module.
 */

const Pointer = (): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="16"
      viewBox="0 0 8 16"
      className={classNames('nav-module-pointer', styles.pointer)}>
      <path d="M7.29289 7.2929L0 0V16L7.29289 8.7071C7.68342 8.3166 7.68342 7.6834 7.29289 7.2929Z" />
    </svg>
  );
};

export default Pointer;
