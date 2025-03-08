import { IAugmentedAttributes } from 'apps/entity-details/types/entity-data.types';
import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState,
  IArrowRotate
} from '@lsq/nextgen-preact/accordion/accordion.types';
import styles from './sections.module.css';
import Content from '../content';
import { isMobileDevice } from 'common/utils/helpers';

interface ISection {
  data: IAugmentedAttributes;
}

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
const Section = ({ data }: ISection): JSX.Element => {
  return (
    <section data-testid="ead-section">
      <Accordion
        name={<span title={data?.name}>{data?.name}</span>}
        defaultState={DefaultState.OPEN}
        customHeaderStyle={styles.accordion_header}
        arrowRotate={getArrowRotate()}>
        <Content fields={data?.fields} />
      </Accordion>
    </section>
  );
};

export default Section;
