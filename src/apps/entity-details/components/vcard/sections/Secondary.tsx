import Shimmer from '@lsq/nextgen-preact/shimmer';
import { ISection } from '../../../types/vcard.types';
import ComponentRenderer from '../ComponentRenderer';
import styles from '../vcard.module.css';
import { IEntityDetailsCoreData } from '../../../types/entity-data.types';

interface ISecondary {
  isLoading: boolean;
  config: ISection | undefined;
  coreData: IEntityDetailsCoreData;
  fieldValues?: Record<string, string | null>;
}

const Secondary = ({ isLoading, config, coreData, fieldValues }: ISecondary): JSX.Element => {
  if (isLoading) {
    return <Shimmer className={styles.secondary_shimmer} />;
  }

  if (config) {
    return (
      <div
        className={`${styles.section} ${config?.customStyleClass}`}
        data-testid="vcard-secondary-section">
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

Secondary.defaultProps = {
  fieldValues: undefined
};
export default Secondary;
