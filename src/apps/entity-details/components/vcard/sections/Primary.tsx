import Shimmer from '@lsq/nextgen-preact/shimmer';
import { ISection } from '../../../types/vcard.types';
import ComponentRenderer from '../ComponentRenderer';
import styles from '../vcard.module.css';
import { IEntityDetailsCoreData } from '../../../types/entity-data.types';

interface IPrimary {
  isLoading: boolean;
  config: ISection | undefined;
  coreData: IEntityDetailsCoreData;
  fieldValues?: Record<string, string | null>;
}

const Primary = ({ isLoading, config, coreData, fieldValues }: IPrimary): JSX.Element => {
  if (isLoading) {
    return (
      <div className={styles.primary_shimmer_wrapper}>
        <Shimmer className={styles.primary_shimmer} />
        <Shimmer className={styles.primary_shimmer_right} />
      </div>
    );
  }

  if (config) {
    return (
      <div
        className={`${styles.section} ${config?.customStyleClass}`}
        data-testid="vcard-primary-section">
        <ComponentRenderer
          isLoading={isLoading}
          components={config?.components}
          coreData={coreData}
          fieldValues={fieldValues}
        />
      </div>
    );
  }
  return <></>;
};

Primary.defaultProps = { fieldValues: undefined };

export default Primary;
