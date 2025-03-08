export const getLeadName = (
  entityFields: Record<string, string | null> | undefined,
  associatedEntityFields: Record<string, string | null> | undefined
): string => {
  if (associatedEntityFields) {
    return `${associatedEntityFields?.FirstName || ''} ${associatedEntityFields?.LastName || ''}`;
  }
  return `${entityFields?.FirstName || ''} ${entityFields?.LastName || ''}`;
};
