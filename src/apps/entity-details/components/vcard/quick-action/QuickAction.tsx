import { trackError } from 'common/utils/experience/utils/track-error';
import IconButton from 'common/component-lib/icon-button';
import styles from './quick-action.module.css';
import Icon from '@lsq/nextgen-preact/icon';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { IQuickActionConfig } from '../../../types';
import { ActionWrapper } from 'common/component-lib/action-wrapper';
import { getConvertedQuickActions } from './utils';
import LeadStarred from './lead-starred';
import { IProcessFormsData, IWorkAreaConfig } from 'common/utils/process/process.types';
import useEntityDetailStore, { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import { handleActionClick, handleMenuItemSelect } from './utils/utils';
import { useEffect, useState } from 'react';
import LeadShare from 'apps/entity-details/entity-action/lead-share';
import { getCallerSource } from '../actions/utils/utils';
import { IEntityDetailsCoreData } from '../../../types/entity-data.types';
import FeatureRestriction from 'common/utils/feature-restriction';

interface IQuickAction {
  config: IQuickActionConfig[] | undefined;
  isLoading: boolean;
  coreData: IEntityDetailsCoreData;
  customStyleClass?: string;
}

const QuickAction = (props: IQuickAction): JSX.Element => {
  const { config, isLoading, customStyleClass, coreData } = props;
  const [processFormsData, setProcessFormsData] = useState<IProcessFormsData | null>(null);
  const [showLeadShare, setShowLeadShare] = useState(false);
  const fieldValues = useEntityDetailStore(
    (state) => state?.augmentedEntityData?.properties?.fields
  );
  const canUpdate = fieldValues?.CanUpdate;
  const representationName = useLeadRepName();

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const fetchData = (await import('common/utils/process/process'))
          .fetchMultipleWorkAreaProcessForms;
        const processForms = await fetchData(
          config
            ?.map((action) => action?.workAreaConfig)
            ?.filter((item) => item) as IWorkAreaConfig[],
          getCallerSource()
        );
        if (processForms) setProcessFormsData(processForms);
      } catch (error) {
        trackError(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getElement = (action: IQuickActionConfig, tooltipContent?: string): JSX.Element => {
    const quickActionElement = (
      <ActionWrapper
        menuKey={`${action?.name}`}
        key={action?.name}
        action={action}
        id={action?.name}
        onMenuItemSelect={(item) => handleMenuItemSelect(item, coreData)}>
        <>
          {action.name === 'leadStar' ? (
            <LeadStarred />
          ) : (
            <IconButton
              key={action?.name}
              onClick={(): void => {
                handleActionClick({
                  actionConfig: action,
                  fieldValues,
                  coreData,
                  setShowLeadShare
                });
              }}
              icon={<Icon name={action?.icon as string} customStyleClass={styles.icon} />}
              customStyleClass={styles.button}
              dataTestId={`quick-action-${action?.name}`}
              title={tooltipContent}
              tooltipContent={tooltipContent}
            />
          )}
        </>
      </ActionWrapper>
    );

    if (action?.featureRestrictionConfig) {
      return (
        <FeatureRestriction
          actionName={action?.featureRestrictionConfig?.actionName}
          moduleName={action?.featureRestrictionConfig?.moduleName}
          callerSource={action?.featureRestrictionConfig?.callerSource}
          placeholderElement={
            <div className={`${styles.wrapper} ${customStyleClass}`}>
              <Shimmer className={styles.shimmer} dataTestId="quick-action-shimmer" />
            </div>
          }>
          {quickActionElement}
        </FeatureRestriction>
      );
    }
    return <>{quickActionElement}</>;
  };

  if (isLoading) {
    return (
      <div className={`${styles.wrapper} ${customStyleClass}`}>
        <Shimmer className={styles.shimmer} dataTestId="quick-action-shimmer" />
      </div>
    );
  }

  if (config) {
    const convertedQuickActions = getConvertedQuickActions(config, processFormsData, canUpdate);
    return (
      <div className={`${styles.wrapper} ${customStyleClass}`}>
        {convertedQuickActions?.map((action) => {
          const tooltipContent = action?.title
            ? action?.title.replace('Lead', representationName.SingularName)
            : undefined;
          return getElement(action, tooltipContent);
        })}
        {showLeadShare ? (
          <LeadShare showModal={showLeadShare} setShowModal={setShowLeadShare} />
        ) : (
          <></>
        )}
      </div>
    );
  }

  return <></>;
};

QuickAction.defaultProps = {
  customStyleClass: ''
};

export default QuickAction;
