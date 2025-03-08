import { classNames } from 'common/utils/helpers';
import styles from './module-items.module.css';
import { INavigationItem, INavigationReferenceMap } from '../../../app-header.types';
import { ArrowDown } from 'assets/custom-icon/v2';
import SingleSelect from '@lsq/nextgen-preact/v2/dropdown/single-select';
import { getActionMenuConvertedData } from './utils';
import { useState } from 'react';

interface IItemProps {
  item: INavigationItem;
  selectedModuleItemId: string;
  isActive: boolean;
  handleModuleItemClick: (id: string) => void;
  navigationReferenceMap: INavigationReferenceMap;
}

/**
 * Displays a single navigation item within the selected module.
 */

// eslint-disable-next-line complexity
const Item = ({
  item,
  selectedModuleItemId,
  isActive,
  handleModuleItemClick,
  navigationReferenceMap
}: IItemProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOnClick = (): void => {
    handleModuleItemClick(item?.Id);
  };

  const selectedModuleItem = navigationReferenceMap?.[selectedModuleItemId]?.data;

  if (item?.SubMenu?.length) {
    return (
      <SingleSelect
        fetchOptions={() => getActionMenuConvertedData(item.SubMenu || [])}
        onSelection={(opt) => {
          handleModuleItemClick(opt?.value ?? '');
        }}
        selectedOption={{
          label: selectedModuleItem?.Label ?? '',
          value: selectedModuleItem?.Id ?? ''
        }}
        open={open}
        onOpenChange={setOpen}>
        <button
          className={classNames(styles.item, isActive ? styles.active : '')}
          title={item?.Label}>
          <div
            className={classNames(
              styles.label,
              'ng_v2_style',
              isActive ? 'ng_p_1_b' : 'ng_p_1_sb'
            )}>
            {item?.Label}
          </div>
          <ArrowDown type="outline" />
        </button>
      </SingleSelect>
    );
  }

  return (
    <button
      className={classNames(styles.item, isActive ? styles.active : '')}
      title={item?.Label}
      onClick={handleOnClick}>
      <div className={classNames(styles.label, 'ng_v2_style', isActive ? 'ng_p_1_b' : 'ng_p_1_sb')}>
        {item?.Label}
      </div>
    </button>
  );
};

export default Item;
