import { Variant } from 'common/types';
import styles from './button.module.css';
import Spinner from '@lsq/nextgen-preact/spinner';

export interface IButton
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'type'> {
  text: string | JSX.Element;
  onClick: <T>(data?: T) => Promise<void> | void;
  icon?: JSX.Element;
  variant?: Variant;
  customStyleClass?: string;
  dataTestId?: string;
  rightIcon?: JSX.Element;
  isLoading?: boolean;
  showToolTip?: boolean;
}

const Button = ({
  text,
  onClick,
  variant,
  icon,
  customStyleClass,
  dataTestId,
  rightIcon,
  isLoading,
  showToolTip,
  ...props
}: IButton): JSX.Element => {
  const className = `${styles.marvin_button} ${styles?.[`${variant?.toLowerCase()}_variant`]} ${
    props.disabled ? styles.disabled : ''
  } ${icon ? styles.size_with_icon : styles.size_without_icon} ${customStyleClass} marvin_btn`;

  const textClass = `${styles.text_wrapper}  button_text`;

  const getButtonText = (): JSX.Element => {
    return (
      <div className={textClass} title={props.title || (text as string)}>
        {text}
        {isLoading ? <Spinner customStyleClass={styles.loading_spinner} /> : null}
      </div>
    );
  };

  return (
    <button
      type="button"
      onClick={async () => {
        await onClick();
      }}
      className={className}
      data-testid={dataTestId}
      {...props}>
      {icon}
      {getButtonText()}
      {rightIcon}
    </button>
  );
};

Button.defaultProps = {
  variant: Variant.Secondary,
  icon: undefined,
  customStyleClass: '',
  dataTestId: '',
  rightIcon: <></>,
  isLoading: false
};

export default Button;
