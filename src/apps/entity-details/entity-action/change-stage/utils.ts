import { trackError } from 'common/utils/experience/utils/track-error';
import { IFetchCommentsOptions, IResponse, IResponseOption } from './change-stage.types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { EntityType } from 'common/types';
import { getAPI, getSelectedSchemaName } from '../helper';
import { ACTION } from '../../constants';

const fetchOption = async (config?: {
  searchKeyWord?: string;
  entityDetailsType?: EntityType;
  entityTypeId?: string;
  leadType?: string;
}): Promise<IResponseOption[]> => {
  const { searchKeyWord, entityDetailsType, entityTypeId, leadType } = config ?? {};
  const schema = getSelectedSchemaName(entityDetailsType, ACTION.ChangeStage);

  try {
    const path = getAPI(entityDetailsType, leadType);

    const response = (await httpPost({
      path,
      module: Module.Marvin,
      body: {
        SchemaName: schema,
        SearchText: searchKeyWord,
        Count: 50,
        Type: entityTypeId
      },
      callerSource: CallerSource.LeadDetailsVCard
    })) as IResponse;
    return response?.Options || [];
  } catch (error) {
    trackError(error);
  }
  return [];
};

const fetchCommentsOptions = async (props: IFetchCommentsOptions): Promise<IOption[]> => {
  const { config } = props;
  if (config?.Options) {
    const options = config?.Options?.split('~').map((opt) => ({
      label: opt,
      value: opt
    }));
    return options;
  }
  return [];
};

export { fetchOption, fetchCommentsOptions };
