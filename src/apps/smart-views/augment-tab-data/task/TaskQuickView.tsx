import { IRecordType, IRowActionConfig } from '../../components/smartview-tab/smartview-tab.types';
import QuickView from 'src/v2/quick-view/QuickView';
import { EntityType } from 'src/common/types';
import useRowActions from '../../components/cell-renderers/row-actions/useRowActions';
import { ReactNode, useEffect } from 'react';
import { isManageTab, updateGridDataAfterPause } from '../../utils/utils';
import { IActionConfig } from 'src/apps/entity-details/types';
import { useActiveTab } from '../../components/smartview-tab/smartview-tab.store';
import { setQuickViewContent } from 'src/store/quick-view';
import smartViewStyle from '../../smartviews.module.css';

const getTaskQuickViewActions = (tabId: string, actions?: IRowActionConfig): IActionConfig[] => {
  const moreActions = !isManageTab(tabId)
    ? actions?.moreActions.flatMap((action) => action.children)
    : actions?.moreActions;

  const allTaskActions = [...(actions?.quickActions ?? []), ...(moreActions ?? [])];

  return allTaskActions as IActionConfig[];
};

const TaskQuickView = (props: { item: IRecordType }): ReactNode => {
  const { actionHelpers, actions, loading } = useRowActions({ record: props?.item });
  const tabId = useActiveTab();

  useEffect(() => {
    const classList = document.getElementById(tabId + '-' + props.item.id)?.classList;
    classList?.add(smartViewStyle.quick_view_active);
    return () => {
      classList?.remove(smartViewStyle.quick_view_active);
    };
  }, []);

  if (loading) return;
  return (
    <QuickView
      entityId={props?.item?.id}
      entityType={EntityType.Task}
      entityTypeCode={props?.item?.TaskTypeId ?? undefined}
      entityRecord={props?.item}
      actionsConfig={{
        actions: getTaskQuickViewActions(tabId, actions),
        actionHelper: {
          ...actionHelpers,
          isSmartviews: true,
          onSuccess: updateGridDataAfterPause
        }
      }}
    />
  );
};

export const onRowClick = ({ item }: { item: IRecordType }): void => {
  const content = <TaskQuickView key={item.id} item={item} />;
  setQuickViewContent(content);
};
