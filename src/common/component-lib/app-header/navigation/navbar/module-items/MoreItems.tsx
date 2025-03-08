import { Option } from 'assets/custom-icon/v2';
import styles from './module-items.module.css';
import { INavigationItem, INavigationReferenceMap } from '../../../app-header.types';
import { getActionMenuConvertedData } from './utils';
import { useState } from 'react';
import SingleSelect from '@lsq/nextgen-preact/v2/dropdown/single-select';

interface IMoreItemsProps {
  moreItems: INavigationItem[];
  selectedModuleItemId: string;
  handleModuleItemClick: (id: string) => void;
  navigationReferenceMap: INavigationReferenceMap;
}
const MoreItems = ({
  moreItems,
  handleModuleItemClick,
  selectedModuleItemId,
  navigationReferenceMap
}: IMoreItemsProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);

  const selectedModuleItem = navigationReferenceMap?.[selectedModuleItemId]?.data;

  return (
    <SingleSelect
      fetchOptions={() => getActionMenuConvertedData(moreItems)}
      selectedOption={{
        label: selectedModuleItem?.Label ?? '',
        value: selectedModuleItem?.Id ?? ''
      }}
      onSelection={(item) => {
        handleModuleItemClick(item?.value ?? '');
      }}
      open={open}
      onOpenChange={setOpen}>
      <button className={styles.more_items}>
        <Option type="outline" />
      </button>
    </SingleSelect>
  );
};

export default MoreItems;
