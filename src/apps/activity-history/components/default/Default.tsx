import Timeline from 'common/component-lib/timeline';
import Body from './Body';
import Icon from './Icon';
import DateTime from '../shared/date-time';
import { IAugmentedAHDetail } from '../../types';

export interface IDefault {
  data: IAugmentedAHDetail;
}

const Default = (props: IDefault): JSX.Element => {
  const { data } = props;

  // TODO : - custom and email activity

  return (
    <Timeline
      timeline={{
        data: data
      }}
      components={{
        Icon,
        DateTime,
        Body
      }}
    />
  );
};

export default Default;
