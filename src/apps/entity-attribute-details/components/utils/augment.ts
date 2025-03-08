import { ActivityBaseAttributeDataType, DataType } from 'common/types/entity/lead';
import { getFormattedDate, getFormattedDateTime, getFormattedTime } from 'common/utils/date';
import { NOT_UPLOADED, PREVIEW_NOT_AVAILABLE, VIEW_FILES } from 'common/constants';

const ONE = '1';
const ZERO = '0';
const BOOLEAN_CONFIG = {
  [ONE]: 'Yes',
  [ZERO]: 'No'
};

const getBooleanValue = (value: string): string => {
  if (value === ZERO) {
    return BOOLEAN_CONFIG[ZERO];
  }
  if (value === ONE) {
    return BOOLEAN_CONFIG[ONE];
  }
  return '';
};

const getFileValue = (value: string): string => {
  if (!value) {
    return NOT_UPLOADED;
  }
  if (value === PREVIEW_NOT_AVAILABLE.value) {
    return PREVIEW_NOT_AVAILABLE.label;
  }
  if (value) {
    return VIEW_FILES;
  }
  return value;
};

const getAugmentedValue = (
  dataType: DataType | ActivityBaseAttributeDataType,
  value: string
): string => {
  switch (dataType) {
    case DataType.Boolean:
      return getBooleanValue(value);
    case DataType.Date:
      return getFormattedDate(value, '');
    case DataType.Time:
      return getFormattedTime(value, '');
    case DataType.DateTime:
      return getFormattedDateTime({ date: value });
    case DataType.File:
      return getFileValue(value);
    default:
      return value;
  }
};

export { getAugmentedValue };
