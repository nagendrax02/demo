import { classNames, isDarkMode } from 'common/utils/helpers/helpers';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));
import { GroupConfig, IGroupedOption } from '../grouped-option-dropdown.types';
import styles from './input.module.css';
import Icon from '@lsq/nextgen-preact/icon';

interface ISelectedOptionRenderer {
  options: IGroupedOption[];
  groupConfig: GroupConfig;
  onOptionClear: (option: IGroupedOption) => void;
}

const SelectedOptionRenderer = (props: ISelectedOptionRenderer): JSX.Element => {
  const { options, groupConfig, onOptionClear } = props;

  const renderOptionLabel = (option: IGroupedOption): string => {
    const showSecondaryLabelOnSelect = groupConfig?.[option?.group]?.showSecondaryLabelOnSelect;
    return `${option.label} ${
      showSecondaryLabelOnSelect && option?.secondaryLabel ? `(${option?.secondaryLabel})` : ''
    }`;
  };

  const renderOption = (option: IGroupedOption): JSX.Element => {
    const selectedGroup = groupConfig?.[option?.group];

    const optionElement = (
      <div
        data-testid="grouped-option-dropdown-selected-option"
        className={`${styles.option} ${
          option?.inputCustomStyleClass ? option?.inputCustomStyleClass : ''
        } ${isDarkMode() ? styles.option_color_dark : styles.option_color} option_render`}>
        {selectedGroup?.icon ? (
          <Icon
            name={selectedGroup?.icon}
            customStyleClass={classNames(styles.option_icon, 'render_icon')}
          />
        ) : null}
        <div className={classNames(styles.option_label, 'option_label')}>
          {renderOptionLabel(option)}{' '}
        </div>
        <div
          className={styles.clear_button_wrapper}
          onClick={() => {
            onOptionClear(option);
          }}
          data-testid="grouped-option-dropdown-clear-option">
          <Icon name="close" customStyleClass={classNames(styles.clear_button, 'clear_icon')} />
        </div>
      </div>
    );

    if (option?.inputTooltipMessage) {
      return (
        <Tooltip
          content={<div>{option?.inputTooltipMessage}</div>}
          placement={Placement.Vertical}
          trigger={[Trigger.Hover]}>
          {optionElement}
        </Tooltip>
      );
    } else return optionElement;
  };

  return (
    <>
      {options?.map((option) => {
        const CustomRenderer = groupConfig?.[option?.group]?.optionsRenderer;
        if (CustomRenderer) {
          return <CustomRenderer key={option.value} option={option} onClear={onOptionClear} />;
        } else {
          return renderOption(option);
        }
      })}
    </>
  );
};

export default SelectedOptionRenderer;
