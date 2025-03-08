import Timeline from 'common/component-lib/timeline';
import { IAugmentedAHDetail } from '../../types';
import DateTime from '../shared/date-time';
import Icon from './Icon';
import Body from './Body';
import Actions from '../custom/actions';
import { ACTIVITY } from '../../constants';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';

export interface IDynamicFormSubmission {
  data: IAugmentedAHDetail;
  entityDetailsCoreData: IEntityDetailsCoreData;
}

const DynamicFormSubmission = ({
  data,
  entityDetailsCoreData
}: IDynamicFormSubmission): JSX.Element | null => {
  const GetAction = (): JSX.Element | null => {
    if (data.ActivityEvent !== ACTIVITY.PAYMENT) {
      return null;
    }
    return (
      <Actions
        data={data}
        viewAction={false}
        deleteAction={false}
        leadId={data?.LeadId}
        editAction={!!data?.IsEditable}
        entityDetailsCoreData={entityDetailsCoreData}
      />
    );
  };
  return (
    <Timeline
      timeline={{
        data: data,
        coreData: entityDetailsCoreData
      }}
      components={{
        Icon,
        DateTime,
        Body,
        Actions: GetAction
      }}
    />
  );
};

export default DynamicFormSubmission;
