import Modal from '@lsq/nextgen-preact/modal';
import SortableList, { ISortableItem } from 'common/component-lib/sortable-list';
import { ITabConfiguration } from 'common/types/entity/lead';
import useManageTabs from '../manage-tab.store';
import React, { useEffect, useRef, useState } from 'react';
import useEntityTabsStore from 'common/component-lib/entity-tabs/store';
import withSuspense from '@lsq/nextgen-preact/suspense';
import styles from '../manage-tabs.module.css';
import ManageTabShimmer from './ManageTabShimmer';
const RemoveTabModal = withSuspense(React.lazy(() => import('./RemoveTabModal')));

const Body = (): JSX.Element => {
  const sortedTabConfig = useManageTabs((state) => state.sortedTabConfig);
  const setSortedTabConfig = useManageTabs((state) => state.setSortedTabConfig);
  const init = useManageTabs((state) => state.init);
  const tabConfig = useEntityTabsStore((state) => state.tabConfig) || [];
  const isLoading = useRef(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const removeCallBack = useRef(() => {});

  useEffect(() => {
    init(tabConfig);
    isLoading.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRemove = (id: string, removeCallback: () => void): void => {
    removeCallBack.current = removeCallback;
    setShowConfirmation(true);
  };

  return (
    <>
      <Modal.Body customStyleClass={styles.modal_body}>
        {isLoading.current ? (
          <ManageTabShimmer />
        ) : (
          <div data-testid="manage-tab-body">
            <SortableList
              sortableList={sortedTabConfig}
              onChange={(data: ISortableItem<ITabConfiguration>[]) => {
                setSortedTabConfig(data);
              }}
              onRemove={onRemove}
              suspenseFallback={<ManageTabShimmer />}
            />
          </div>
        )}
      </Modal.Body>
      {showConfirmation ? (
        <RemoveTabModal onRemove={removeCallBack.current} setShowModal={setShowConfirmation} />
      ) : null}
    </>
  );
};

export default Body;
