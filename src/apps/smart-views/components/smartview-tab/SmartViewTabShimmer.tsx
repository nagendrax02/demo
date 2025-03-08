import Shimmer from '@lsq/nextgen-preact/v2/shimmer';
import styles from './smartviews-tab.module.css';
import { GridShimmer } from '@lsq/nextgen-preact/v2/grid';
import { classNames } from 'src/common/utils/helpers/helpers';

const SmartViewTabShimmer = ({
  rows,
  styleClassName,
  spaceOnTop
}: {
  rows?: number;
  styleClassName?: string;
  spaceOnTop?: number;
}): JSX.Element => {
  const gridRows = rows == 0 ? Math.floor((window.innerHeight - (spaceOnTop ?? 150)) / 50) : rows;

  return (
    <div className={classNames(styles.layout_grid_container_shimmer, styleClassName)}>
      <div className={styles.header_shimmer_wrapper}>
        <div className={styles.actions_shimmer_wrapper}>
          <Shimmer height="32px" width="280px" className="panel_shimmer" />
          <Shimmer height="32px" width="280px" className="panel_shimmer" />
        </div>
        <Shimmer height="24px" width="320px" className="panel_shimmer" />
      </div>
      <GridShimmer rows={gridRows} columns={3} />
    </div>
  );
};

SmartViewTabShimmer.defaultProps = {
  rows: 0,
  styleClassName: '',
  spaceOnTop: 150
};

export default SmartViewTabShimmer;
