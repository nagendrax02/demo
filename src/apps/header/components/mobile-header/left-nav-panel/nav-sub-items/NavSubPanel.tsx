import { INavItem } from 'apps/header/header.types';
import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState,
  ToggleIconPosition
} from '@lsq/nextgen-preact/accordion/accordion.types';
import NavItem from '../nav-items/NavItem';
import styles from '../left-nav-panel.module.css';
import NavSubItems from './NavSubItems';

interface INavSubPanel {
  navItem: INavItem;
}

const NavSubPanel = ({ navItem }: INavSubPanel): JSX.Element => {
  return (
    <div className={styles.nav_items}>
      <Accordion
        name={<NavItem navItem={navItem} />}
        defaultState={DefaultState.CLOSE}
        arrowRotate={{
          angle: ArrowRotateAngle.Deg180,
          direction: ArrowRotateDirection.AntiClockWise
        }}
        toggleIconPosition={ToggleIconPosition.Right}
        customStyle={styles.accordion_custom_style}>
        <NavSubItems navItem={navItem} />
      </Accordion>
    </div>
  );
};

export default NavSubPanel;
