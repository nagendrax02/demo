import { IEntityDetailsCoreData, ITabsConfig } from 'apps/entity-details/types/entity-data.types';
import { Content } from '../../tabs';
import styles from './tab-content.module.css';
import Renderer from './Renderer';

interface ITabContent {
  tabKey: string;
  config: ITabsConfig[] | undefined;
  isActive?: boolean;
  refreshConfig: Record<string, string>;
  coreData: IEntityDetailsCoreData;
}

const TabContent = ({
  tabKey,
  config,
  isActive,
  refreshConfig,
  coreData
}: ITabContent): JSX.Element => {
  const selectedTabConfig = config?.find((tab) => tab?.id === tabKey);

  return (
    <Content
      customStyleClass={`${styles.tab_content} ${
        isActive ? styles.tab_active : styles.tab_inactive
      }`}
      key={refreshConfig?.[tabKey]}>
      <Renderer tab={selectedTabConfig} coreData={coreData} />
    </Content>
  );
};

TabContent.defaultProps = {
  isActive: false
};

export default TabContent;
