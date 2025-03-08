import { appendCustomActions, getListActions, reduceActions } from './helpers';
import { IList } from 'common/types/entity/list/list.types';
import { IAugmentedAction } from 'apps/entity-details/types/entity-data.types';
import { LIST_STATIC_ACTIONS } from './constants';

const getActions = (entityData: IList): IAugmentedAction => {
  const listStaticActions = getListActions(LIST_STATIC_ACTIONS, entityData);
  const actions = appendCustomActions({
    moreActions: reduceActions({ listStaticActions, entityData }),
    customActions: { ...entityData?.details?.customActions }
  });

  return { actions } as IAugmentedAction;
};

export { getActions };
