import { trackError } from 'common/utils/experience';

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

export { decodeHtmlEntities };
