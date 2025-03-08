import { useEffect, useState } from 'react';
import styles from '../../entity-details.module.css';
import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState,
  IArrowRotate
} from '@lsq/nextgen-preact/accordion/accordion.types';
import { isMobileDevice } from 'src/common/utils/helpers';
import useEntityDetailStore from '../../entitydetail.store';
import Loader from './Loader';
import Property from './Property';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { IPropertiesConfig } from '../../types';
import ChangePrimaryContact from '../../entity-action/change-primary-contact';
import { IEntityDetailsCoreData } from '../../types/entity-data.types';
import {
  AccessType,
  ActionType,
  PermissionEntityType,
  getRestrictedData,
  isRestricted
} from 'common/utils/permission-manager';
import { CallerSource } from 'common/utils/rest-client';
import { getAccountTypeId } from 'common/utils/helpers/helpers';
import { PRIMARY_CONTACT } from '../../constants';
import { canUpdateAccount } from './utils';

interface IAssociatedProperty {
  properties: IPropertiesConfig;
  entityDetailsCoreData: IEntityDetailsCoreData;
}

const AssociatedProperty = (props: IAssociatedProperty): JSX.Element => {
  const { properties, entityDetailsCoreData } = props;
  const isMobile = isMobileDevice();

  const [showChangePrimaryContactModal, setShowChangePrimaryContactModal] = useState(false);
  const isLoading = useEntityDetailStore((state) => state.isLoading);

  const augmentedAssociatedProperty = useEntityDetailStore(
    (state) => state?.augmentedEntityData?.associatedLeadProperties
  );

  const [isEditRestricted, setIsEditRestricted] = useState(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const accountTypeId = getAccountTypeId();
      const canUpdate = canUpdateAccount(properties?.fields?.CanUpdate || '');

      const permissionData = await Promise.all([
        getRestrictedData({
          entityType: PermissionEntityType.Accounts,
          actionType: ActionType.Update,
          entityId: accountTypeId,
          callerSource: CallerSource.AccountDetailsProperties
        }),
        isRestricted({
          entity: PermissionEntityType.Accounts,
          action: ActionType.Update,
          entityId: accountTypeId,
          callerSource: CallerSource.AccountDetailsProperties
        }),
        isRestricted({
          entity: PermissionEntityType.Accounts,
          action: ActionType.Update,
          entityId: accountTypeId,
          schemaName: PRIMARY_CONTACT,
          callerSource: CallerSource.AccountDetailsProperties
        }),
        isRestricted({
          entity: PermissionEntityType.Accounts,
          action: ActionType.View,
          entityId: accountTypeId,
          schemaName: PRIMARY_CONTACT,
          callerSource: CallerSource.AccountDetailsProperties
        })
      ]);

      const [data, isRestrict, isPrimaryContactEditRestricted, isPrimaryContactViewRestricted] =
        permissionData;

      const restricted =
        isRestrict ||
        isPrimaryContactEditRestricted ||
        isPrimaryContactViewRestricted ||
        !canUpdate;

      setIsEditRestricted(restricted || data.accessType === AccessType.NoAccess);
    };

    fetchData();
  }, []);

  const getArrowRotate = (): IArrowRotate => {
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

  const getStyle = (): boolean => {
    if (!augmentedAssociatedProperty?.entityProperty?.length && !isLoading) return true;
    return false;
  };

  return (
    <div className={`${getStyle() ? styles.no_data : ''}`}>
      <Accordion
        name="Primary Contact"
        defaultState={isMobile ? DefaultState.CLOSE : DefaultState.OPEN}
        arrowRotate={getArrowRotate()}
        isLoading={isLoading}
        action={
          isLoading || isEditRestricted ? (
            <></>
          ) : (
            <>
              <div
                className={styles.edit_icon_wrapper}
                onClick={() => {
                  setShowChangePrimaryContactModal(true);
                }}>
                <Icon
                  variant={IconVariant.Filled}
                  name={'edit'}
                  customStyleClass={styles.edit_icon}
                />
              </div>
            </>
          )
        }>
        {isLoading ? (
          <Loader />
        ) : (
          <Property properties={properties} entityIds={entityDetailsCoreData?.entityIds} />
        )}
      </Accordion>

      {showChangePrimaryContactModal ? (
        <ChangePrimaryContact
          showChangePrimaryContactModal={showChangePrimaryContactModal}
          setShowChangePrimaryContactModal={setShowChangePrimaryContactModal}
          currentPrimaryContactId={augmentedAssociatedProperty?.fields?.PC_ProspectID}
        />
      ) : null}
    </div>
  );
};

export default AssociatedProperty;
