import { lazy } from 'react';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import styles from '../cell-renderer.module.css';
import { IRecordType } from '../../smartview-tab/smartview-tab.types';
import { updateGridDataAfterPause } from 'apps/smart-views/utils/utils';
import withSuspense from '@lsq/nextgen-preact/suspense';
import useRowActions from './useRowActions';

const ButtonActions = withSuspense(
  lazy(() => import('apps/entity-details/components/vcard/actions/button-actions'))
);

const MoreActions = withSuspense(
  lazy(() => import('apps/entity-details/components/vcard/actions/more-actions'))
);

interface IRowActions {
  record: IRecordType;
}
// eslint-disable-next-line complexity
const RowActions = ({ record }: IRowActions): JSX.Element => {
  const { actionHelpers, actions, loading } = useRowActions({ record });
  const { coreData, customConfig } = actionHelpers;
  return (
    <div className={styles.row_actions}>
      {loading ? (
        <Shimmer width="100%" height="25px" />
      ) : (
        <>
          {actions?.quickActions?.length ? (
            <ButtonActions
              coreData={coreData}
              isSmartviews
              customConfig={customConfig}
              onSuccess={updateGridDataAfterPause}
              actions={actions?.quickActions}
              customClass={styles.quick_actions}
              entityRecords={[record]}
              renderAsV2Component
            />
          ) : null}
          {actions?.moreActions?.length ? (
            <MoreActions
              isSmartviews
              coreData={coreData}
              onSuccess={updateGridDataAfterPause}
              customConfig={customConfig}
              actions={actions?.moreActions}
              menuDimension={{ topOffset: 12 }}
              customClass={styles.more_actions}
              entityRecords={[record]}
              renderAsV2Component
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default RowActions;
