import { AugmentedGroupedOption, GroupConfig } from './grouped-option-dropdown.types';

export const generateDefaultOptions = (groupConfig: GroupConfig): AugmentedGroupedOption => {
  const defaultOptions = {};
  Object.keys(groupConfig).map((group) => {
    defaultOptions[group] = [];
  });
  return defaultOptions;
};

export const getGroupOrder = (groupConfig: GroupConfig): string[] => {
  const sortedKeys = Object.keys(groupConfig).sort((a, b) => {
    const orderA = groupConfig[a].displayOrder || Number.MAX_SAFE_INTEGER;
    const orderB = groupConfig[b].displayOrder || Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });

  return sortedKeys;
};
