import { ReactNode } from 'react';
import styles from './grid-quick-view.module.css';
import { useQuickView } from 'src/store/quick-view';
import { classNames } from 'common/utils/helpers/helpers';

const GridQuickView = (): ReactNode => {
  const component = useQuickView((store) => store.component);
  if (component) {
    return (
      <div
        className={classNames(
          styles.grid_quick_view_wrapper,
          component ? styles.populate_content : ''
        )}>
        {component}
      </div>
    );
  }
  return <></>;
};

export default GridQuickView;
