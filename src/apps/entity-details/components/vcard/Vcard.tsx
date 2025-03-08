import { IVCardConfig } from '../../types';
import styles from './vcard.module.css';
import { Body, Footer } from './sections';
import { isMobileDevice } from 'common/utils/helpers';
import { EntityDetailsEvents } from 'common/utils/experience';
import { useEffect } from 'react';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { IEntityDetailsCoreData } from '../../types/entity-data.types';
import useEntityDetailsNewRelic from '../../use-entityDetails-newRelic';

interface IVCardProps {
  config: IVCardConfig | undefined;
  coreData: IEntityDetailsCoreData;
  isLoading: boolean;
  fieldValues?: Record<string, string | null>;
}

const VCard = ({ config, isLoading, coreData, fieldValues }: IVCardProps): JSX.Element => {
  const isMobile = isMobileDevice();
  useEntityDetailsNewRelic({ event: EntityDetailsEvents.VCardRender });

  useEffect(() => {
    //Inserted the below line to introduce an error to check fatal scenarios.
    if (getItem(StorageKey.InduceFatal) === 1) {
      throw new Error('Induced intentional fatal');
    }
  }, []);

  return (
    <div
      className={`${styles.vcard_container} ${isMobile ? styles.mobile_vcard : ''}`}
      data-testid="vcard-container">
      <Body
        isLoading={isLoading}
        config={config?.body}
        coreData={coreData}
        fieldValues={fieldValues}
      />
      {isMobile ? (
        <Footer isLoading={isLoading} config={config?.footer} coreData={coreData} />
      ) : null}
    </div>
  );
};

VCard.defaultProps = {
  fieldValues: undefined
};

export default VCard;
