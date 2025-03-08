import { lazy, ReactNode } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import ButtonIcon from './ButtonIcon';
import { IButtonAction } from 'apps/entity-details/types/entity-data.types';
import { classNames } from 'common/utils/helpers/helpers';
import styles from '../actions.module.css';
import ButtonText from './ButtonText';
import V2Icon from './V2Icon';
const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));
const IconButton = withSuspense(
  lazy(() =>
    import('@lsq/nextgen-preact/v2/button').then((module) => ({ default: module.IconButton }))
  )
);

const Action = ({
  action,
  handleAction,
  customClass,
  renderAsV2Component
}: {
  customClass?: string;
  action: IButtonAction;
  handleAction: (action: IButtonAction) => Promise<void>;
  renderAsV2Component?: boolean;
}): ReactNode => {
  if (renderAsV2Component) {
    if (action.customComponent)
      return (
        <button
          className={classNames('unstyle_button', styles.entity_button_actions, customClass)}
          onClick={() => {
            handleAction(action);
          }}
          key={action.id}
          disabled={action?.disabled}>
          {action.customComponent}
        </button>
      );
    return (
      <IconButton
        icon={<V2Icon action={action} />}
        key={action.id}
        onClick={() => {
          handleAction(action);
        }}
        disabled={action?.disabled}
        customStyleClass={classNames(styles.entity_button_actions, customClass)}
        dataTestId={action?.id}
        size="xs"
        variant="secondary"
      />
    );
  }
  return (
    <Button
      icon={<ButtonIcon action={action} />}
      text={<ButtonText action={action} />}
      key={action.id}
      onClick={() => {
        handleAction(action);
      }}
      disabled={action?.disabled}
      customStyleClass={styles.entity_button_actions + ' ' + customClass}
      dataTestId={action?.id}
      title={action?.toolTip ?? action.title}
    />
  );
};

Action.defaultProps = {
  renderAsV2Component: false,
  customClass: ''
};

export default Action;
