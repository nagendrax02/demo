import { PanelItem } from '@lsq/nextgen-preact/panel';
import styles from './sv-panel.module.css';
import MoreTabs from './MoreTabs';
import { Option } from 'assets/custom-icon/v2';
import { IDragItems } from '@lsq/nextgen-preact/draggable-list/draggableList.types';
import { DragEventHandler } from 'react';

interface IMoreOptions {
  getOverflowTabList: () => IDragItems[];
  showMoreOptions: boolean;
  setShowMoreOptions: (showMoreOptions: boolean) => void;
  handleDrop: (event) => Promise<void>;
  handleDragStart: DragEventHandler<HTMLDivElement>;
}

const MoreOptions = ({
  getOverflowTabList,
  showMoreOptions,
  setShowMoreOptions,
  handleDrop,
  handleDragStart
}: IMoreOptions): JSX.Element => {
  const onMoreOptionsClick = (): void => {
    setShowMoreOptions(!showMoreOptions);
  };
  return (
    <>
      <PanelItem
        contentStyles={styles.sv_more_options_container}
        selectionProps={{
          isSelectable: true,
          onContentClick: onMoreOptionsClick
        }}>
        <Option type="outline" className={styles.sv_more_options_icon} />
      </PanelItem>
      {showMoreOptions ? (
        <MoreTabs
          getOverflowTabList={getOverflowTabList}
          handleDrop={handleDrop}
          handleDragStart={handleDragStart}
        />
      ) : null}
    </>
  );
};

export default MoreOptions;
