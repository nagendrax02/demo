import { resetFilters } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { Button } from '@lsq/nextgen-preact/v2/button';
import Delete from 'assets/custom-icon/v2/Delete';
import styles from '../search-filter.module.css';
import { classNames } from 'common/utils/helpers/helpers';

interface IClearFilters {
  tabId: string;
  filterCount: number;
}

const ClearFilters = (props: IClearFilters): JSX.Element | null => {
  const { filterCount, tabId } = props;

  const handleClick = (): void => {
    resetFilters(tabId);
  };

  return filterCount ? (
    <Button
      customStyleClass={classNames(styles.clear_filters, 'ng_btn_2_sb')}
      onClick={handleClick}
      text={<div>Clear</div>}
      variant="secondary"
      size="sm"
      icon={<Delete type="outline" />}
    />
  ) : null;
};

export default ClearFilters;
