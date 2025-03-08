import { RenderType } from 'common/types/entity/lead';
import { IEntityProperty } from 'common/types/entity/lead/metadata.types';

export interface IField {
  label: string;
  value: string;
  renderType: RenderType;
}

export interface IInlineEntityDetailsProps {
  title: string;
  fetchData: () => Promise<IEntityProperty[]> | IEntityProperty[];
  customStyleClass?: string;
  tabId: string;
}
