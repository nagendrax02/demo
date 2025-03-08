import { IconButton } from '@lsq/nextgen-preact/v2/button';
import styles from './action.module.css';
import { classNames } from 'common/utils/helpers/helpers';

interface IActionIconProps {
  icon: JSX.Element;
}

const ActionIcon = (props: IActionIconProps): JSX.Element => {
  const { icon } = props;
  return (
    <IconButton
      icon={icon}
      onClick={(): void => {}}
      customStyleClass={classNames(styles.entity_more_actions)}
      dataTestId="entity-header-more-actions"
      size="xs"
      variant={'tertiary-gray'}
    />
  );
};

export default ActionIcon;
