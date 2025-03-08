import ActionShimmer from './ActionShimmer';
import styles from './actions.module.css';
import ButtonActions from './button-actions';
import useActions from './use-actions';
import MoreActions from './more-actions';
import {
  IAugmentedAction,
  IEntityDetailsCoreData
} from 'apps/entity-details/types/entity-data.types';
import { EntityType } from 'common/types';

interface IAction {
  config: IAugmentedAction;
  isLoading: boolean;
  coreData: IEntityDetailsCoreData;
  customStyleClass?: string;
  fieldValues?: Record<string, unknown>;
}

const Actions = (props: IAction): JSX.Element => {
  const { isLoading, config, coreData, customStyleClass, fieldValues } = props;
  const { buttonActions, moreActions } = useActions(config);

  return (
    <div
      className={`${styles.entity_action_wrapper} ${customStyleClass}`}
      data-testid={'action-wrapper'}>
      {isLoading ? (
        <ActionShimmer />
      ) : (
        <>
          <ButtonActions
            actions={buttonActions}
            coreData={coreData}
            customConfig={
              // Passing IsActivityRestricted flag for the Add Activity button in the Lead Details view to filter activities which are integrated with the process
              coreData?.entityDetailsType === EntityType.Lead
                ? { IsActivityRestricted: 'true' }
                : {}
            }
            entityRecords={fieldValues ? [fieldValues] : undefined}
          />
          <MoreActions
            actions={moreActions}
            coreData={coreData}
            entityRecords={fieldValues ? [fieldValues] : undefined}
          />
        </>
      )}
    </div>
  );
};

Actions.defaultProps = {
  customStyleClass: '',
  fieldValues: undefined
};

export default Actions;
