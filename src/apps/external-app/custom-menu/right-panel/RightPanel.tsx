import Header from './Header';
import styles from './styles.module.css';
import CustomMenuIframe from './CustomMenuIframe';
import { ICustomMenu } from '../custom-menu.types';

const RightPanel = ({
  selectedMenu,
  defaultIframeAttributes
}: {
  selectedMenu: ICustomMenu;
  defaultIframeAttributes: string;
}): JSX.Element => {
  return (
    <div className={styles.right_panel_wrapper}>
      <Header selectedMenu={selectedMenu} />
      <CustomMenuIframe
        defaultIframeAttributes={defaultIframeAttributes}
        selectedMenu={selectedMenu}
      />
    </div>
  );
};

export default RightPanel;
