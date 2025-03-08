import { IconContentType, IIconConfig } from 'apps/entity-details/types';
import styles from './vcard-config.module.css';

const getAugmentedIcon = (): IIconConfig => {
  return { content: '', contentType: IconContentType.None, customStyleClass: styles.icon_hide };
};

export { getAugmentedIcon };
