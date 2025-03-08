import React from 'react';
import { IAugmentedTabConfig } from '../types';
import { Tab } from 'common/component-lib/tabs';

interface ITabItems {
  data: IAugmentedTabConfig[] | null;
  activeTabKey: string;
  onTabClick: (tabKey: string) => void;
}

const TabItems = (props: ITabItems): JSX.Element => {
  const { data, activeTabKey, onTabClick } = props;

  if (!data) {
    return <></>;
  }

  return (
    <>
      {data?.map((tab: IAugmentedTabConfig) => {
        if (!tab.isOverflowing && tab?.id && tab?.name) {
          return (
            <Tab
              key={tab?.id}
              tabKey={tab?.id}
              name={tab?.name}
              activeTabKey={activeTabKey}
              setActiveTabKey={onTabClick}
            />
          );
        }
      })}
    </>
  );
};

export default TabItems;
