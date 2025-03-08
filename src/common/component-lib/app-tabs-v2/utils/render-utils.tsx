import Icon from '@lsq/nextgen-preact/icon';
import { ITabConfig, TabIconType } from '../app-tabs.types';
import { Accounts, Lead, Opportunity } from 'assets/custom-icon/v2';

const EntityIconMap: Record<string, (config: ITabConfig) => JSX.Element> = {
  [TabIconType.Lead]: () => <Lead type="outline" />,
  [TabIconType.Account]: () => <Accounts type="outline" />,
  [TabIconType.Opportunity]: () => <Opportunity type="outline" />
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
  return appTabConfig?.length;
};
