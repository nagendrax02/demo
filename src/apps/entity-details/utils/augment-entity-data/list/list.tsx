import { getAugmentedVCard } from './vcard';
import ManageLeadsListDetail from 'apps/smart-views/components/custom-tabs/manage-list-lead-detail';
import { IList } from 'common/types/entity/list/list.types';
import { IAugmentedEntity } from 'apps/entity-details/types';

const augmentedLeadData = (entityData: IList): IAugmentedEntity => {
  return {
    vcard: getAugmentedVCard(entityData),
    customMainComponent: ManageLeadsListDetail,
    tabs: [],
    properties: {
      entityProperty: [],
      fields: {},
      entityConfig: {}
    },
    attributes: {
      detailsConfiguration: { Sections: [] },
      fields: {},
      metadata: {}
    }
  };
};

export default augmentedLeadData;
