import Accordion from '@lsq/nextgen-preact/accordion';
import { isMobileDevice } from 'common/utils/helpers';
import { INormalizedSubmissionRetrievalData } from '../../submission-retrieval.types';
import Content from '../content';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import SubmissionStatusIcon from '../submission-status-icon';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState,
  IArrowRotate
} from '@lsq/nextgen-preact/accordion/accordion.types';

const getArrowRotate = (): IArrowRotate => {
  if (isMobileDevice())
    return {
      angle: ArrowRotateAngle.Deg90,
      direction: ArrowRotateDirection.ClockWise
    };
  else
    return {
      angle: ArrowRotateAngle.Deg180,
      direction: ArrowRotateDirection.ClockWise
    };
};

interface ISection {
  data: INormalizedSubmissionRetrievalData;
  coreData?: IEntityDetailsCoreData;
}

const Section = ({ data, coreData }: ISection): JSX.Element => {
  return (
    <section data-testid="section">
      <Accordion
        name={data?.title}
        defaultState={DefaultState.OPEN}
        arrowRotate={getArrowRotate()}
        customIcon={
          data?.submissionStatusConfig ? (
            <SubmissionStatusIcon config={data?.submissionStatusConfig} />
          ) : undefined
        }>
        <Content fields={data?.fields} coreData={coreData} />
      </Accordion>
    </section>
  );
};

export default Section;
