import { PanelBody } from '@lsq/nextgen-preact/panel';
import styles from './sv-panel.module.css';
import { IDragItems } from '@lsq/nextgen-preact/draggable-list/draggableList.types';
import { DragEventHandler } from 'react';

interface IMoreTabsProps {
  getOverflowTabList: () => IDragItems[];
  handleDrop: (event) => Promise<void>;
  handleDragStart: DragEventHandler<HTMLDivElement>;
}

const MoreTabs = ({
  getOverflowTabList,
  handleDrop,
  handleDragStart
}: IMoreTabsProps): JSX.Element => {
  return (
    <PanelBody
      customStyleClass={styles.sv_more_tabs_container}
      onContentDrop={handleDrop}
      onContentDragStart={handleDragStart}
      dragItems={getOverflowTabList()}
      showDragIcon={false}
    />
  );
};

export default MoreTabs;
