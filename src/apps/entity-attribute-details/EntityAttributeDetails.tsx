import { Header, Sections } from './components';
import { getAugmentedAttributes } from './augment-data/attributes';
import React, { useEffect } from 'react';
import { useEntityAttributeDetailsStore } from './store/entity-attribute-details-store';
import useEntityDetailStore, { useLeadRepName } from '../entity-details/entitydetail.store';
import { IEntityDetailsCoreData } from '../entity-details/types/entity-data.types';

interface IEntityAttributeDetails {
  tabId: string;
  entityDetailsCoreData: IEntityDetailsCoreData;
}

const EntityAttributeDetails = ({
  tabId,
  entityDetailsCoreData
}: IEntityAttributeDetails): JSX.Element => {
  const { setAugmentedAttributes } = useEntityAttributeDetailsStore();
  const attributes = useEntityDetailStore((state) => state?.augmentedEntityData?.attributes);
  const leadRepName = useLeadRepName();

  useEffect(() => {
    setAugmentedAttributes(
      getAugmentedAttributes({
        attributes: attributes?.detailsConfiguration,
        fields: attributes?.fields,
        metaData: attributes?.metadata,
        leadRepName: leadRepName?.SingularName || 'Lead',
        entityDetailsCoreData
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  return (
    <div data-testid="entity-attribute-details">
      <Header tabId={tabId} entityDetailsCoreData={entityDetailsCoreData} />
      <Sections />
    </div>
  );
};

export default React.memo(EntityAttributeDetails);
