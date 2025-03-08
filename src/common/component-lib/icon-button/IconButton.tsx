import { Theme } from '../../types';
import Spinner from '@lsq/nextgen-preact/spinner';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import styles from './iconbutton.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface IIconButton
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'type'> {
  onClick: (data: React.MouseEvent<HTMLButtonElement>) => void;
  icon: JSX.Element;
  customStyleClass?: string;
  dataTestId?: string;
  isLoading?: boolean;
  tooltipContent?: string;
}

const IconButton = ({
  onClick,
  icon,
  customStyleClass,
  dataTestId,
  isLoading,
  tooltipContent,
  ...props
}: IIconButton): JSX.Element => {
  const className = `${styles.marvin_icon_button} ${
    props.disabled ? styles.disabled : ''
  } ${customStyleClass}`;

  const getButton = (): JSX.Element => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={className}
        data-testid={dataTestId}
        {...props}>
        {isLoading ? <Spinner customStyleClass={styles.spinner} /> : icon}
      </button>
    );
  };

  if (tooltipContent) {
    return (
      <Tooltip
        content={tooltipContent}
        placement={Placement.Vertical}
        trigger={[Trigger.Hover]}
        theme={Theme.Dark}>
        {getButton()}
      </Tooltip>
    );
  }
  return getButton();
};

IconButton.defaultProps = {
  customStyleClass: '',
  dataTestId: '',
  isLoading: false,
  tooltipContent: undefined
};

export default IconButton;
