import Timeline from 'common/component-lib/timeline';
import { IAugmentedAHDetail } from '../../types';
import DateTime from '../shared/date-time';
import Icon from './Icon';
import Body from './Body';
import Actions from '../custom/actions';
import { IEntityDetailsCoreData } from '../../../entity-details/types/entity-data.types';

export interface IEmail {
  data: IAugmentedAHDetail;
  entityDetailsCoreData: IEntityDetailsCoreData;
}

const Email = (props: IEmail): JSX.Element => {
  const { data, entityDetailsCoreData } = props;

  const GetAction = (): JSX.Element => {
    return (
      <Actions
        data={data}
        replyEmail
        isEmailActivity
        entityDetailsCoreData={entityDetailsCoreData}
      />
    );
  };

  return (
    <div data-testid="email">
      <Timeline
        timeline={{
          data: data,
          entityDetailsCoreData
        }}
        components={{
          Icon,
          DateTime,
          Body,
          Actions: GetAction
        }}
      />
    </div>
  );
};

export default Email;
