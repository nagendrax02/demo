import { PanelOrientation } from './constants/constants';
import styles from './smartviews.module.css';
import { isMiP } from 'common/utils/helpers';
import { PanelShimmer } from '@lsq/nextgen-preact/panel';
import SmartViewTabShimmer from './components/smartview-tab/SmartViewTabShimmer';

const SmartViewsShimmer = ({
  orientation,
  loadOnlyGrid
}: {
  orientation?: PanelOrientation;
  loadOnlyGrid?: boolean;
}): JSX.Element => {
  const gridRows = Math.floor((window.innerHeight - 150) / 50);

  const renderPanel = (): JSX.Element | null => {
    return !loadOnlyGrid ? (
      <PanelShimmer
        panelOrientation={isMiP() ? PanelOrientation.Top : orientation ?? PanelOrientation.Left}
      />
    ) : null;
  };

  return (
    <div className={styles.shimmer_layout}>
      <div
        className={
          loadOnlyGrid || orientation == PanelOrientation.Left
            ? styles.layout_container_with_leftpanel
            : styles.layout_container_with_toppanel
        }>
        {renderPanel()}
        <SmartViewTabShimmer
          rows={orientation == PanelOrientation.Top ? gridRows - 1 : gridRows}
          styleClassName={
            loadOnlyGrid || orientation == PanelOrientation.Left
              ? styles.layout_grid_container_with_leftpanel
              : styles.layout_grid_container_with_toppanel
          }
        />
      </div>
    </div>
  );
};

SmartViewsShimmer.defaultProps = {
  orientation: PanelOrientation.Left,
  loadOnlyGrid: false
};

export default SmartViewsShimmer;
