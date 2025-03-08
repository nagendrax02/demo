import ActionMenu from '@lsq/nextgen-preact/action-menu';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import Icon from '@lsq/nextgen-preact/icon';
import { HELP_OPTIONS } from '../../constants';
import styles from '../styles.module.css';

const Help = (): JSX.Element => {
  const onSelect = (option: IMenuItem): void => {
    window.open(option.value, '_blank');
  };

  return (
    <div className={styles.nav_item}>
      <ActionMenu
        menuKey={'help'}
        actions={HELP_OPTIONS}
        onSelect={onSelect}
        menuDimension={{ topOffset: 1 }}
        customStyleClass={styles.action_menu_style}>
        <Icon customStyleClass={styles.icon_font_size} name="help" />
      </ActionMenu>
    </div>
  );
};

export default Help;
