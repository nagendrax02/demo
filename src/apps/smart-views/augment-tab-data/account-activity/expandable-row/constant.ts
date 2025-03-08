import { IMetaDataConfig } from 'apps/entity-details/types';
import { DataType, RenderType } from 'common/types/entity/lead';

export const vCardSecondaryData: (IMetaDataConfig & { dependentSchema?: string[] })[] = [
  {
    SchemaName: 'C_Website',
    DisplayName: 'Website',
    RenderType: RenderType.URL,
    DataType: DataType.Website,
    Value: ''
  },
  {
    SchemaName: 'C_Phone',
    DisplayName: 'Phone',
    RenderType: RenderType.Textbox,
    DataType: DataType.Text,
    Value: ''
  },
  {
    SchemaName: 'C_City',
    DisplayName: 'Address',
    RenderType: RenderType.Textbox,
    DataType: DataType.Text,
    Value: '',
    dependentSchema: ['C_State', 'C_Country']
  }
];
