import { IHeader } from 'apps/mip-menu/header.types';
import { profileIconsMap } from 'apps/mip-menu/components/constants';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from '../styles.module.css';

const CustomOption = (item: IHeader): JSX.Element => {
  return (
    <div className={styles.profile_items}>
      {profileIconsMap[item.Path] ? (
        <Icon
          name={profileIconsMap[item.Path].name as string}
          variant={profileIconsMap[item.Path].variant as IconVariant}
        />
      ) : null}
      <div>{item.Caption}</div>
    </div>
  );
};

export default CustomOption;
