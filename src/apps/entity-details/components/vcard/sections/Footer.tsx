import { IEntityDetailsCoreData } from '../../../types/entity-data.types';
import { IFooterConfig } from '../../../types/vcard.types';
import ComponentRenderer from '../ComponentRenderer';
import styles from '../vcard.module.css';
import Shimmer from '@lsq/nextgen-preact/shimmer';

export interface IFooter {
  isLoading: boolean;
  config: IFooterConfig | undefined;
  coreData: IEntityDetailsCoreData;
}

const Footer = ({ isLoading, config, coreData }: IFooter): JSX.Element => {
  if (isLoading) {
    return (
      <div className={styles.footer_shimmer_wrapper}>
        <Shimmer className={styles.footer_shimmer} />
        <Shimmer className={styles.footer_shimmer} />
        <Shimmer className={styles.footer_shimmer} />
        <Shimmer className={styles.footer_shimmer} />
      </div>
    );
  }

  if (config) {
    return (
      <div
        className={`${styles.footer} ${config?.customStyleClass || ''}`}
        data-testid="vcard-footer">
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

export default Footer;
