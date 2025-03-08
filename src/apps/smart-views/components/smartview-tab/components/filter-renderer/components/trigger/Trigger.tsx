import styles from './trigger.module.css';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import Chip from 'apps/smart-views/components/smartview-tab/components/chip';
import { classNames } from 'common/utils/helpers/helpers';
import { MouseEventHandler, ReactNode } from 'react';
import { ArrowDown } from 'assets/custom-icon/v2';
import Tooltip from '@lsq/nextgen-preact/tooltip';
import { Placement, Trigger as TooltipTrigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { Theme } from '@lsq/nextgen-preact/common/common.types';

export enum TriggerState {
  Disabled,
  Active,
  Inactive
}

interface ITrigger {
  dropdownLabel: string;
  selectedOptions: IOption[];
  onClear: () => void;
  triggerState: TriggerState;
  disableTooltip?: string;
}

const Trigger = (props: ITrigger): JSX.Element => {
  const { dropdownLabel, selectedOptions, onClear, triggerState, disableTooltip } = props;
  const isActive = triggerState === TriggerState.Active;
  const isDisabled = triggerState === TriggerState.Disabled;

  const isCloseIcon = (): boolean => {
    return Boolean(selectedOptions?.length);
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (isCloseIcon()) {
      event.stopPropagation();
      event.preventDefault();
      onClear();
    }
  };

  const getSelectedOptionsLabel = (): ReactNode => {
    if (!selectedOptions?.length) {
      return '';
    }

    const text = selectedOptions[0].label;
    const plusNumber = selectedOptions.length > 1 ? `+${selectedOptions.length - 1}` : '';
    return (
      <>
        <div
          className={styles.trigger_card_text}
          title={selectedOptions.map((option) => option.label).join(', ')}>
          {text}
        </div>{' '}
        {plusNumber}
      </>
    );
  };

  return (
    <Tooltip
      content={disableTooltip ?? ''}
      placement={Placement.Vertical}
      theme={Theme.Dark}
      trigger={[TooltipTrigger.Hover]}>
      <Chip
        className={classNames(
          isActive ? styles.trigger_active : styles.trigger_inactive,
          isDisabled ? styles.trigger_disable : ''
        )}
        label={dropdownLabel}
        subLabel={getSelectedOptionsLabel()}
        onCrossClick={handleClick}
        customIcon={
          !isCloseIcon() ? (
            <ArrowDown
              type="outline"
              className={classNames(
                styles.arrow_icon,
                isActive ? styles.arrow_icon_active : '',
                isDisabled ? styles.arrow_icon_disable : ''
              )}
            />
          ) : undefined
        }
        onButtonClick={() => {}}
      />
    </Tooltip>
  );
};

Trigger.defaultProps = {
  disableTooltip: ''
};
export default Trigger;
