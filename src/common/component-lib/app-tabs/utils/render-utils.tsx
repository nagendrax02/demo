import Opportunity from 'assets/custom-icon/Opportunity';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { ITabConfig, TabIconType, TabType } from '../app-tabs.types';

const EntityIconMap: Record<string, (config: ITabConfig) => JSX.Element> = {
  [TabIconType.Lead]: (config) => (
    <Icon name="person" variant={config?.isActiveTab ? IconVariant.Filled : IconVariant.Outlined} />
  ),
  [TabIconType.Account]: (config) => (
    <Icon
      name="business"
      variant={config?.isActiveTab ? IconVariant.Filled : IconVariant.Outlined}
    />
  ),
  [TabIconType.Opportunity]: () => <Opportunity />
};

export const getTabIcon = (config: ITabConfig): JSX.Element | null => {
  if (config?.showErrorState) {
    return <Icon name={config?.isActiveTab ? 'warning' : 'warning_amber'} />;
  }
  if (config?.iconType === TabIconType.Custom) {
    return <Icon name={config?.customIconName ?? ''} />;
  } else {
    return EntityIconMap?.[config?.iconType](config);
  }
};

export const getAppTabCount = (appTabConfig: ITabConfig[]): number => {
  const secondaryTabs = appTabConfig?.filter((tab) => tab?.type === TabType.Secondary);
  return secondaryTabs?.length;
};
