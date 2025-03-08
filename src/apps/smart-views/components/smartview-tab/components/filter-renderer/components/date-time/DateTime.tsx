import DateFilter, { IDateOption } from 'common/component-lib/date-filter/v2';
import { useEffect, useState } from 'react';
import styles from '../../filter-renderer.module.css';
import { DATE_FILTER } from '../../constants';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { classNames } from 'common/utils/helpers/helpers';
import { getTriggerState } from '../../utils/utils';
import Trigger from '../trigger/Trigger';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IFilter } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { isFilterSelected } from 'apps/smart-views/components/smartview-tab/utils';
import { getDateDisplayLabel } from './utils';
import { getDefaultOption } from 'src/common/component-lib/date-filter/utils';

export interface IDateTime {
  defaultValues: IDateOption;
  onChange: (option: IDateOption) => void;
  customOptionStyle?: string;
  enableDateTimePicker?: boolean;
  includeSecondsForEndDate?: boolean;
  avoidUTCFormatting?: boolean;
  filterLabel: string;
  schemaName: string;
  filters: IFilter;
  onOpenChange: (open: boolean) => void;
}

const DateTime = (props: IDateTime): JSX.Element => {
  const {
    onChange,
    onOpenChange,
    defaultValues,
    customOptionStyle,
    enableDateTimePicker,
    avoidUTCFormatting,
    filterLabel,
    schemaName,
    filters,
    includeSecondsForEndDate
  } = props;
  const [selectedOption, setSelectedOption] = useState<IDateOption>(defaultValues);
  const [customStyle, setCustomStyle] = useState(
    defaultValues?.value === DATE_FILTER.CUSTOM ? customOptionStyle : ''
  );
  const [open, setOpen] = useState<boolean>(false);
  const openByDefault = filters?.filterToOpenOnMount === schemaName;

  if (openByDefault && !open) {
    setOpen(true);
  }

  useEffect(() => {
    setSelectedOption(defaultValues);
  }, [defaultValues]);

  const handleOnChange = (option: IDateOption): void => {
    if (option?.value !== DATE_FILTER.CUSTOM) {
      setCustomStyle('');
    }

    setSelectedOption(option);
    onChange?.(option);
  };

  const handleCustomOption = (): void => {
    setCustomStyle(`${customOptionStyle}`);
  };

  const getTriggerLabel = (): IOption => {
    if (selectedOption.value !== DATE_FILTER.CUSTOM) {
      return selectedOption;
    }
    return {
      ...selectedOption,
      label: `${getDateDisplayLabel(
        selectedOption.startDate,
        Boolean(enableDateTimePicker),
        Boolean(avoidUTCFormatting)
      )} - ${getDateDisplayLabel(
        selectedOption.endDate,
        Boolean(enableDateTimePicker),
        Boolean(avoidUTCFormatting)
      )}`
    };
  };

  const handleFilterClear = (): void => {
    onChange({ ...getDefaultOption(undefined), startDate: '', endDate: '' });
    setOpen(false);
    onOpenChange(false);
  };

  const getTrigger = (
    isOpen: boolean,
    setSelectedValues: (selectedValues: IOption[]) => void
  ): JSX.Element => {
    return (
      <Trigger
        dropdownLabel={filterLabel}
        selectedOptions={isFilterSelected(selectedOption) ? [getTriggerLabel()] : []}
        triggerState={getTriggerState(isOpen)}
        onClear={() => {
          setSelectedValues([]);
          handleFilterClear();
        }}
      />
    );
  };

  return (
    <DateFilter
      selectedOption={selectedOption}
      setSelectedOption={handleOnChange}
      onCustomOptionSelection={handleCustomOption}
      customStyleClass={classNames(customStyle, styles.date_filter)}
      suspenseFallback={<Shimmer style={{ height: '34px', width: '200px' }} />}
      showDateTimePickerForCustom={enableDateTimePicker}
      avoidUTCFormatting={avoidUTCFormatting}
      getTrigger={getTrigger}
      openOnRender={open}
      includeSecondsForEndDate={includeSecondsForEndDate}
      onOpenChange={onOpenChange}
    />
  );
};

DateTime.defaultProps = {
  customOptionStyle: '',
  enableDateTimePicker: false,
  includeSecondsForEndDate: false,
  avoidUTCFormatting: false
};

export default DateTime;
