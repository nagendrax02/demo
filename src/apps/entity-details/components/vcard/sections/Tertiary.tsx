import Shimmer from '@lsq/nextgen-preact/shimmer';
import { ISection } from '../../../types/vcard.types';
import ComponentRenderer from '../ComponentRenderer';
import styles from '../vcard.module.css';
import { IEntityDetailsCoreData } from '../../../types/entity-data.types';

export interface ITertiary {
  isLoading: boolean;
  config: ISection | undefined;
  coreData: IEntityDetailsCoreData;
}

const Tertiary = ({ isLoading, config, coreData }: ITertiary): JSX.Element => {
  if (isLoading) {
    return (
      <div className={styles.tertiary_shimmer_wrapper}>
        <Shimmer className={styles.tertiary_shimmer} />
        <Shimmer className={styles.tertiary_shimmer} />
      </div>
    );
  }

  if (config) {
    return (
      <div
        className={`${styles.section} ${config?.customStyleClass}`}
        data-testid="vcard-tertiary-section">
        <ComponentRenderer
          isLoading={isLoading}
          components={config?.components}
          coreData={coreData}
        />
      </div>
    );
  }
  return <></>;
};

export default Tertiary;
