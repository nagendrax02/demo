import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { trackError } from 'common/utils/experience';

const getDoNotCallMessage = (leadRepName: IEntityRepresentationName): string => {
  return `Cannot initiate the call as the ${
    leadRepName?.SingularName || 'Lead'
  } has opted for DoNotCall`;
};

function decodeHtmlEntities(encodedString: string): string {
  try {
    // Check if the string contains HTML entities
    if (!encodedString?.includes('&#')) {
      return encodedString; // Return the string as is if no entities are found
    }
    // Decode hexadecimal and decimal HTML entities
    return (
      encodedString
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ?.replace(/&#x([0-9a-fA-F]+);/g, (_match, hex) => String.fromCharCode(parseInt(hex, 16)))
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ?.replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(parseInt(dec, 10)))
    );
  } catch (error) {
    trackError(error);
    return encodedString;
  }
}

export { getDoNotCallMessage, decodeHtmlEntities };
