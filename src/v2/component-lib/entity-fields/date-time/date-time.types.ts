import { DateRenderType } from 'apps/entity-details/types/entity-data.types';

interface IDateTime {
  date: string;
  renderType: DateRenderType;
  dateTimeFormat?: string;
  timeFormat?: string;
  timeZone?: string;
  schemaName?: string;
  ignoreSystemTimeValue?: boolean;
}

export type { IDateTime };
