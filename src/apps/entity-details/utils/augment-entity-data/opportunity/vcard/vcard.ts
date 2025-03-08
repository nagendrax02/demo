import { trackError } from 'common/utils/experience/utils/track-error';
import { IOpportunity } from 'common/types';
import { IVCardConfig } from '../../../../types';
import { IBodyConfig } from '../../../../types/vcard.types';
import { getAugmentedIcon } from './vcard-icon';
import { getSectionBasedConfig } from './utils';
import { getPrimarySection } from './vcard-primary';
import { getSecondarySection } from './vcard-secondary';

const getAugmentedBody = (entityData: IOpportunity, isUpdateRestricted?: boolean): IBodyConfig => {
  const { primary, secondary } = getSectionBasedConfig(entityData);

  return {
    icon: getAugmentedIcon(),
    primarySection: getPrimarySection(entityData, primary, isUpdateRestricted),
    secondarySection: getSecondarySection(entityData, secondary)
  };
};

// const getAugmentedFooter = (entityData: IOpportunity): IFooterConfig | undefined => {};

const getAugmentedVCard = (
  entityData: IOpportunity,
  isUpdateRestricted?: boolean
): IVCardConfig => {
  try {
    return {
      body: getAugmentedBody(entityData, isUpdateRestricted)
      // footer: getAugmentedFooter(entityData)
    };
  } catch (error) {
    trackError(error);
    throw error;
  }
};

export { getAugmentedVCard };
