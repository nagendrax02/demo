import { DO_NOT_CONTACT_MSG } from 'v2/component-lib/entity-fields/constant';

const getEmailFieldTooltipContent = (
  fieldValues: Record<string, string | null> | undefined
): string | undefined => {
  if (fieldValues?.DoNotEmail === '1' || fieldValues?.P_DoNotEmail === '1') {
    return DO_NOT_CONTACT_MSG.DoNotEmail;
  }
  return undefined;
};

export { getEmailFieldTooltipContent };
