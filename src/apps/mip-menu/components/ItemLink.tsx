import { IHeader } from '../header.types';
import styles from '../header.module.css';
import { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import { getUrl, replaceRepName } from '../utils';
import Icon from '@lsq/nextgen-preact/icon';

export interface IItemLink {
  item: IHeader;
  customClass?: string;
  children?: JSX.Element;
  hasSubMenu?: boolean;
  showModal?: (show: boolean) => void;
}

const ItemLink = ({
  item,
  children,
  customClass,
  hasSubMenu,
  showModal
}: IItemLink): JSX.Element => {
  const leadRepName = useLeadRepName();

  item.Caption = replaceRepName(item, leadRepName);
  const handleItemClick = (): void => {
    if (item?.Path === 'signout') {
      showModal?.(true);
    }
  };

  return (
    <>
      <div className={styles.link_container}>
        <a
          className={`${styles.item_link} ${customClass}`}
          href={getUrl(item)}
          onClick={handleItemClick}>
          {children ? children : item.Caption}
        </a>
        {hasSubMenu && item.Children?.length ? <Icon name="chevron_right" /> : null}
      </div>
    </>
  );
};
ItemLink.defaultProps = {
  children: undefined,
  customClass: '',
  hasSubMenu: false,
  showModal: undefined
};
export default ItemLink;
