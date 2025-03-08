import { getTabData, useActiveTab } from '../../../smartview-tab/smartview-tab.store';
import { IListDetails } from '../list-details.types';
import BackButton from './BackButton';
import styles from './list-details-info.module.css';
import ListInfoModal from './list-info-modal';
import ListTypeBadge from './ListTypeBadge';
import { classNames as cn } from 'common/utils/helpers/helpers';

const HeaderLeftControls = ({ listDetails }: { listDetails: IListDetails }): JSX.Element => {
  const activeTab = useActiveTab();
  const { headerConfig } = getTabData(activeTab);
  return (
    <div className={styles.list_details_info_container}>
      <BackButton />
      <div className={cn(styles.ellipsis, 'ng_h_2_b')} title={headerConfig?.primary?.title}>
        {headerConfig?.primary?.title}
      </div>
      <ListTypeBadge listDetails={listDetails} />
      <ListInfoModal />
    </div>
  );
};

export default HeaderLeftControls;
