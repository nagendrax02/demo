import { trackError } from 'common/utils/experience/utils/track-error';
import { useLeadRepName } from '../../entitydetail.store';
import { useEffect, useState } from 'react';
import useEntityDetailStore from '../../entitydetail.store';
import styles from '../../entity-details.module.css';
import Loader from './Loader';
import Property from './Property';
import { getEntityId, isMobileDevice } from 'common/utils/helpers';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import Accordion from '@lsq/nextgen-preact/accordion';
import { EntityType } from 'common/types';
import {
  ActionType,
  PermissionEntityType
} from 'common/utils/permission-manager/permission-manager.types';
import { CallerSource } from 'common/utils/rest-client';
import { IPropertiesConfig } from '../../types';
import { IAssociatedEntityDetails, IEntityDetailsCoreData } from '../../types/entity-data.types';
import { permissionEntitityType } from './constants';
import { IProcessFormsData } from 'common/utils/process/process.types';
import { getConvertedEditAction, handleEdit, showEditPropertiesProcessForm } from './utils';
import { ActionWrapper } from 'common/component-lib/action-wrapper';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import FeatureRestriction from 'common/utils/feature-restriction';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState,
  IArrowRotate
} from '@lsq/nextgen-preact/accordion/accordion.types';

interface IProperties {
  type: EntityType;
  properties: IPropertiesConfig;
  entityDetailsCoreData: IEntityDetailsCoreData;
  associatedEntityDetails?: IAssociatedEntityDetails;
}

const getArrowRotate = (isMobile: boolean): IArrowRotate => {
  if (isMobile)
    return {
      angle: ArrowRotateAngle.Deg90,
      direction: ArrowRotateDirection.ClockWise
    };
  else
    return {
      angle: ArrowRotateAngle.Deg180,
      direction: ArrowRotateDirection.ClockWise
    };
};

// eslint-disable-next-line max-lines-per-function, complexity
const Properties = (props: IProperties): JSX.Element => {
  const { type, properties, entityDetailsCoreData, associatedEntityDetails } = props;

  const entityProperties = properties?.entityProperty;
  const fieldValues = properties?.fields;
  const [isEditRestricted, setIsEditRestricted] = useState(false);
  const [processFormsData, setProcessFormsData] = useState<IProcessFormsData | null>(null);
  const isLoading = useEntityDetailStore((state) => state.isLoading);

  const convertedEditAction = getConvertedEditAction({
    action: { workAreaConfig: properties?.workAreaConfig },
    processFormsData,
    isLoading
  });

  const accordionName = useLeadRepName();
  const canUpdate = fieldValues?.CanUpdate;
  const isMobile = isMobileDevice();

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const module = await import('common/utils/permission-manager');
        const isRestrict = await module.isRestricted({
          entity: permissionEntitityType[properties?.editActionType || type]
            .permissionType as PermissionEntityType,
          action: ActionType.Update,
          entityId:
            (properties?.editActionType || type) === EntityType.Opportunity
              ? `${entityDetailsCoreData?.eventCode}`
              : getEntityId() || entityDetailsCoreData?.entityIds?.lead,
          callerSource: permissionEntitityType[properties?.editActionType || type]
            .callerSource as CallerSource
        });

        setIsEditRestricted(isRestrict);
      } catch (error) {
        trackError(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async (): Promise<void> => {
      if (properties?.workAreaConfig) {
        try {
          const fetchData = (await import('common/utils/process/process'))
            .fetchMultipleWorkAreaProcessForms;
          const processForms = await fetchData([properties?.workAreaConfig], CallerSource.Tasks);
          if (processForms) setProcessFormsData(processForms);
        } catch (error) {
          trackError(error);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStyle = (): boolean => {
    if (!entityProperties?.length && !isLoading) return true;
    return false;
  };

  const getAccordianName = (): string => {
    return properties?.title ? properties?.title : `${accordionName.SingularName} Properties`;
  };

  const handleMenuItemSelect = async (data: IMenuItem): Promise<void> => {
    await showEditPropertiesProcessForm({
      data,
      coreData: entityDetailsCoreData
    });
  };

  const getProperties = (): JSX.Element => {
    if (isLoading) {
      return <Loader />;
    }
    return (
      <Property
        properties={properties}
        entityIds={entityDetailsCoreData?.entityIds}
        associatedEntityDetails={associatedEntityDetails}
      />
    );
  };

  const getEditActionElement = (): JSX.Element => {
    const editActionElement = (
      <ActionWrapper
        menuKey={`${convertedEditAction.id}`}
        action={convertedEditAction}
        id={convertedEditAction.id || ''}
        onMenuItemSelect={handleMenuItemSelect}>
        <div
          className={styles.edit_icon_wrapper}
          onClick={() => {
            handleEdit({
              type,
              entityDetailsCoreData,
              properties,
              isLoading
            });
          }}>
          <Icon variant={IconVariant.Filled} name={'edit'} customStyleClass={styles.edit_icon} />
        </div>
      </ActionWrapper>
    );
    if (properties?.featureRestrictionConfig) {
      return (
        <FeatureRestriction
          actionName={properties?.featureRestrictionConfig.actionName}
          moduleName={properties?.featureRestrictionConfig.moduleName}
          callerSource={properties?.featureRestrictionConfig.callerSource}
          placeholderElement={
            <div>
              <Shimmer className={styles.shimmer} />
            </div>
          }>
          {editActionElement}
        </FeatureRestriction>
      );
    }
    return editActionElement;
  };

  return (
    <div className={`${styles.property_details_wrapper} ${getStyle() ? styles.no_data : ''}`}>
      <Accordion
        name={getAccordianName()}
        defaultState={isMobile ? DefaultState.CLOSE : DefaultState.OPEN}
        arrowRotate={getArrowRotate(isMobile)}
        isLoading={isLoading}
        action={
          isLoading ? (
            <></>
          ) : (
            <>
              {canUpdate?.toLocaleLowerCase() === 'true' && !isEditRestricted
                ? getEditActionElement()
                : null}
            </>
          )
        }>
        {getProperties()}
      </Accordion>
    </div>
  );
};

Properties.defaultProps = {
  associatedEntityDetails: undefined
};

export default Properties;
