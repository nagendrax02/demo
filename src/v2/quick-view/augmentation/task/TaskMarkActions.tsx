import { ReactNode } from 'react';
import styles from './task.module.css';
import { Button } from '@lsq/nextgen-preact/v2/button';
import { Done } from 'assets/custom-icon/v2';
import Badge from '@lsq/nextgen-preact/v2/badge';
import { classNames } from 'common/utils/helpers/helpers';
import { IActionConfig } from 'apps/entity-details/types';

const MarkOpen = ({ action }: { action: IActionConfig }): ReactNode => (
  <Button
    disabled={action.disabled}
    title={action.toolTip}
    onClick={() => {}}
    size="md"
    variant="secondary-gray"
    text={
      <Badge size="md" status="completed">
        Completed
      </Badge>
    }
    customStyleClass={classNames('unstyle_button', styles.mark_open)}
  />
);

const MarkCompleteButton = ({ action }: { action: IActionConfig }): ReactNode => (
  <Button
    disabled={action.disabled}
    title={action.toolTip}
    onClick={() => {}}
    size="md"
    variant="secondary"
    text={'Mark Complete'}
    customStyleClass={classNames(styles.action, styles.mark_complete)}
    icon={<Done type="outline" />}
  />
);

const CancelTask = (...props): ReactNode => (
  <Badge {...props} size="md" status="cancelled">
    Cancelled
  </Badge>
);

const getCustomComponent = (
  actionType: 'markComplete' | 'markOpen' | 'cancelled',
  action: IActionConfig
): ReactNode | undefined => {
  if (actionType === 'cancelled') return <CancelTask />;

  if (actionType === 'markOpen') return <MarkOpen action={action} />;

  return <MarkCompleteButton action={action} />;
};

export default getCustomComponent;
