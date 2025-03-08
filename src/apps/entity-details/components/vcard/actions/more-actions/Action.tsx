import { lazy, ReactNode } from 'react';
import styles from '../actions.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import Option from 'assets/custom-icon/v2/Option';
import Icon from '@lsq/nextgen-preact/icon';
import { classNames } from 'common/utils/helpers/helpers';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));
const IconButton = withSuspense(
  lazy(() =>
    import('@lsq/nextgen-preact/v2/button').then((module) => ({ default: module.IconButton }))
  )
);

const Action = ({
  renderAsV2Component,
  customClass
}: {
  customClass?: string;
  renderAsV2Component?: boolean;
}): ReactNode => {
  if (renderAsV2Component)
    return (
      <IconButton
        icon={<Option type="outline" className={styles.action_icon_v2} />}
        onClick={(): void => {}}
        customStyleClass={classNames(styles.entity_more_actions, customClass)}
        dataTestId="entity-more-actions"
        size="xs"
        variant={'tertiary-gray'}
      />
    );

  return (
    <Button
      text={''}
      icon={<Icon name="more_horiz" customStyleClass={styles.action_icon} />}
      onClick={(): void => {}}
      customStyleClass={styles.entity_more_actions + ' ' + customClass}
      dataTestId="entity-more-actions"
    />
  );
};

Action.defaultProps = {
  customClass: '',
  renderAsV2Component: false
};
export default Action;
