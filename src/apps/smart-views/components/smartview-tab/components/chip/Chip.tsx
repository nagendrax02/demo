import { classNames } from 'common/utils/helpers/helpers';
import styles from './chip.module.css';
import { IconButton } from '@lsq/nextgen-preact/v2/button';
import { MouseEventHandler, ReactNode } from 'react';
import Icon from '@lsq/nextgen-preact/icon';

interface IChip {
  onButtonClick: () => void;
  onCrossClick: MouseEventHandler<HTMLButtonElement>;
  label: ReactNode;
  subLabel?: ReactNode;
  customIcon?: JSX.Element;
  className?: string;
}

const Chip = (props: IChip): JSX.Element => {
  const { onButtonClick, onCrossClick, label, subLabel, customIcon, className } = props;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event): void => {
    onCrossClick(event);
  };

  return (
    <button className={classNames(styles.chip, className)} onClick={onButtonClick}>
      <div
        className={classNames(styles.chip_label, 'ng_p_1_sb')}
        title={typeof label === 'string' ? label : ''}>
        {label}
      </div>
      {subLabel ? (
        <div className={classNames(styles.chip_sublabel, 'ng_p_1_m', 'sub-label')}>{subLabel}</div>
      ) : null}
      <IconButton
        icon={customIcon ?? <Icon name="close" customStyleClass={styles.close_icon} />}
        onPointerDown={handleClick}
        onClick={() => {}}
        variant="tertiary-gray"
        size="xs"
      />
    </button>
  );
};

Chip.defaultProps = {
  subLabel: '',
  customIcon: undefined,
  className: ''
};
export default Chip;
