import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import SuccessMessage from 'common/component-lib/success-message';
import styles from './tab-settings.module.css';
import { IEntityExportConfig } from './tab-settings.types';
import { TabType } from 'apps/smart-views/constants/constants';
import { getDescription, getMessage, getSubDescription } from './utils';

interface IEntityExportSuccess {
  entityRepName?: IEntityRepresentationName;
  entityExportConfig?: IEntityExportConfig;
  tabType: TabType;
}

const EntityExportSuccess = (props: IEntityExportSuccess): JSX.Element => {
  const { entityRepName, entityExportConfig, tabType } = props;

  return (
    <div className={styles.success_message_wrapper}>
      <SuccessMessage
        message={getMessage(tabType, entityExportConfig, entityRepName)}
        description={getDescription(tabType, entityExportConfig)}
        subDescription={getSubDescription(tabType, entityExportConfig, entityRepName)}
      />
    </div>
  );
};

export default EntityExportSuccess;
