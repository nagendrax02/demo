import Icon from '@lsq/nextgen-preact/icon';
import Logo from 'apps/header/components/company-logo';
import styles from './left-nav-panel.module.css';
import NavItems from './nav-items';

interface INavMenu {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavPanel = ({ show, setShow }: INavMenu): JSX.Element => {
  const onCloseClick = (): void => {
    setShow(false);
  };
  return (
    <div className={`${styles.nav_panel} ${show ? styles.show_nav_panel : ''}`}>
      <div className={styles.nav_panel_header}>
        <Logo />
        <div onClick={onCloseClick}>
          <Icon name="close" />
        </div>
      </div>
      <NavItems />
    </div>
  );
};

export default NavPanel;
