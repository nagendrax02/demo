export const getPinActionTooltipMessage = (
  canUnpin: boolean,
  hasReachedMaxPinnedLimit: boolean
): string => {
  if (!canUnpin) {
    return 'This column can not be unpinned';
  } else if (hasReachedMaxPinnedLimit) {
    return 'Your pinning limit is reached';
  }

  return '';
};
