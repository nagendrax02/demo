import { Ref } from 'react';
import styles from './tabs.module.css';

interface ITabs {
  children: JSX.Element;
  customStyleClass?: string;
  tabsRef?: Ref<HTMLDivElement> | null;
  dataTestId?: string;
}

const Tabs = (props: ITabs): JSX.Element => {
  const { children, customStyleClass, tabsRef, dataTestId } = props;

  return (
    <nav
      ref={tabsRef}
      className={`${styles.tabs} ${customStyleClass}`}
      data-testid={dataTestId || 'tabs'}>
      {children}
    </nav>
  );
};

Tabs.defaultProps = {
  customStyleClass: '',
  tabsRef: null,
  dataTestId: ''
};

export default Tabs;
