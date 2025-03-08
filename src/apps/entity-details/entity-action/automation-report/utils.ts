import { IReport } from './automation.types';

import { trackError } from 'common/utils/experience/utils/track-error';
const handleTriggeredOn = (date: string): string => {
  if (!date) return '';
  try {
    const [datePart, timePart, DayFormat] = date.split(' ');

    const [day, month, year] = datePart.split('/');
    const [hours, minutes] = timePart.split(':');

    return `${day}/${month}/${year} ${hours}:${minutes} ${DayFormat}`;
  } catch (error) {
    trackError(error);
    return date;
  }
};

const computeLevels = (records: IReport[]): IReport[] => {
  if (!Array.isArray(records) || records.length === 0) {
    return [];
  }

  return records.map((record) => {
    let level: number;

    if (record.ParentActionId === 'NA') {
      level = 0;
    } else if (record.ParentActionId) {
      level = record.ParentActionId.split(';').length;
    } else {
      level = 0;
    }
    return {
      ...record,
      Level: level
    };
  });
};

export { handleTriggeredOn, computeLevels };
