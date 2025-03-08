import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { INormalizedSubmissionRetrievalData } from '../../submission-retrieval.types';
import Section from './Section';
import styles from './sections.module.css';

export interface ISections {
  normalizedData: INormalizedSubmissionRetrievalData[] | undefined;
  coreData?: IEntityDetailsCoreData;
}

const Sections = ({ normalizedData, coreData }: ISections): JSX.Element => {
  return (
    <>
      {normalizedData?.map((item) => {
        return (
          <div data-testid="sections" className={styles.sections} key={item.title}>
            <Section data={item} coreData={coreData} />
          </div>
        );
      })}
    </>
  );
};

export default Sections;
