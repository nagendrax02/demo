import { ISortableItem } from 'common/component-lib/sortable-list';
import { ITabConfiguration } from 'common/types/entity/lead';
import Title from '../components/Title';
import { canShowTab } from 'common/component-lib/entity-tabs/utils/general';

export const getSortableList = (
  tabConfig: ITabConfiguration[],
  defaultTabId: string
): ISortableItem<ITabConfiguration>[] => {
  return tabConfig?.map((tab) => {
    return {
      id: tab.Id,
      label: (
        <Title id={tab.Id} title={tab.TabConfiguration.Title} key={tab.Id} tabType={tab.Type} />
      ),
      Id: tab.Id,
      isDraggable: true,
      isRemovable: defaultTabId === tab.Id ? false : tab?.TabContentConfiguration?.CanDelete,
      isHidden: !canShowTab(tab?.Type, tab?.Id),
      config: tab
    };
  });
};

export const getDefaultTabId = (tabConfig: ITabConfiguration[]): string => {
  return tabConfig?.find((tab) => tab?.TabConfiguration?.IsDefault)?.Id || '';
};

export const handleDefaultTabIdUpdate = (
  sortableItem: ISortableItem<ITabConfiguration>[],
  defaultTabId: string
): ISortableItem<ITabConfiguration>[] => {
  const [defaultTab, otherTabs] = sortableItem.reduce(
    (acc, item) => {
      if (item?.config?.Id === defaultTabId) {
        item.isRemovable = false;
        acc[0].push(item);
      } else {
        item.isRemovable = item?.config?.TabContentConfiguration?.CanDelete;
        acc[1].push(item);
      }
      return acc;
    },
    [[], []] as [ISortableItem<ITabConfiguration>[], ISortableItem<ITabConfiguration>[]]
  );
  return [...defaultTab, ...otherTabs];
};
