import styles from './vcard-config.module.css';
import { IList } from 'common/types/entity/list/list.types';
import { IInfoBoxConfig } from 'apps/entity-details/types/entity-data.types';
import ModifiedAndCreatedOn from './Infobox';

const getAugmentedInfo = (entityData: IList): IInfoBoxConfig => {
  const LIST_TYPES = ['Static List', 'Dynamic List', 'Refreshable List'];

  const augmentedInfo = {
    ListInfoBoxDetails: {
      primary: [
        {
          id: '1',
          title: LIST_TYPES[entityData?.details?.ListType],
          seperator: true,
          description: entityData?.details?.Description
        }
      ],
      secondary: [
        {
          title: 'Total Lead Plural',
          value: entityData?.details?.MemberCount,
          customStyle: styles.total_lead
        },
        {
          title: 'Scheduled Email(s)',
          value: entityData?.scheduledEmailCount,
          dependentComponent: {
            isVisible: !!entityData.scheduledEmailCount,
            title: 'View'
          }
        },
        {
          CustomComponent: <ModifiedAndCreatedOn entityData={entityData} />
        }
      ]
    }
  };

  return augmentedInfo;
};

export { getAugmentedInfo };
