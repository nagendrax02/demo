import ActionHandler from './component/ActionHandler';
import LeftAction from './component/LeftAction';
import RightAction from './component/RightAction';
import styles from './mip-header.module.css';
import { isDashboardPage } from './utils';

const MiPHeader = ({ appTabsEnabled }: { appTabsEnabled: boolean }): JSX.Element | null => {
  return isDashboardPage() ? null : (
    <>
      <div className={styles.wrapper}>
        <LeftAction appTabsEnabled={appTabsEnabled} />
        <RightAction />
      </div>
      <ActionHandler />
    </>
  );
};

export default MiPHeader;
