import Tooltip from '@lsq/nextgen-preact/tooltip';
import styles from './manage-list.module.css';
import Icon from '@lsq/nextgen-preact/icon';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { getTabData, useActiveTab } from '../../smartview-tab/smartview-tab.store';

const ListTypeTooltip = (): JSX.Element => {
  const tabId = useActiveTab();

  const pluralName = getTabData(tabId).representationName.PluralName;

  const getTooltipContent = (): JSX.Element => {
    return (
      <div className={styles.header_cell_container}>
        <div className={styles.header_cell_topic_container}>
          <span className={styles.header_cell_topic_name}>Static List:</span> Static List has fixed
          number of {pluralName}. The list can only be changed by manually deleting, adding or
          importing {pluralName}.
        </div>
        <div className={styles.header_cell_topic_container}>
          <span className={styles.header_cell_topic_name}>Dynamic List:</span> Dynamic List is a set
          of {pluralName} defined by a specific criteria. The criteria could be attributes or
          activities of {pluralName}. The number of {pluralName} in the list will change based on
          which {pluralName} meet the criteria specified in the list definition.
        </div>
      </div>
    );
  };

  return (
    <Tooltip
      content={getTooltipContent()}
      placement={Placement.Vertical}
      trigger={[Trigger.Hover]}
      wrapperClass={styles.header_cell_tooltip}>
      <Icon name="info" customStyleClass={styles.list_type_header_tooltip} />
    </Tooltip>
  );
};

export default ListTypeTooltip;
