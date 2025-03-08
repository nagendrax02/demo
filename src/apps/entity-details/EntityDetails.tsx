/* eslint-disable complexity */
import { EntityType } from 'common/types';
import useEntityDetails from './use-entity-details';
import EntityTabs from 'common/component-lib/entity-tabs';
import styles from './entity-details.module.css';
import Metrics from './components/metrics/Metrics';
import { Properties, VCard } from './components';
require('./vcard-styles/vcard-styles.module.css');
import useEntityDetailStore from './entitydetail.store';
import ErrorPage from './error-page';
import { canRenderAssociatedProperty, getStyle } from './utils';
import AssociatedProperty from './components/properties/AssociatedProperty';
import PropertiesWrapper from './components/properties/PropertiesWrapper';
import { EntityDetailsEvents } from 'common/utils/experience';
import { getPropertiesExpEventName } from './components/properties/utils';
import { IAugmentedEntity, IPropertiesConfig } from './types';
import { IEntityDetailsCoreData } from './types/entity-data.types';
interface IEntityDetailsProps {
  type: EntityType;
  queryParams?: string;
  isFullScreenMode?: boolean;
  customStyle?: string;
}

const getAssociatedEntityDetails = (
  coreData: IEntityDetailsCoreData,
  augmentedEntityData: IAugmentedEntity | null
): {
  entityId: string;
  entityType: EntityType;
  entityCode: string | number;
  entityName: string;
} => {
  return {
    entityId: coreData?.entityIds?.opportunity ?? '',
    entityType: EntityType.Opportunity,
    entityCode: coreData?.eventCode ?? '',
    entityName: augmentedEntityData?.attributes?.fields?.mx_Custom_1 ?? ''
  };
};

const EntityDetails = ({
  type,
  queryParams,
  isFullScreenMode,
  customStyle
}: IEntityDetailsProps): JSX.Element => {
  const { error, resetKey, isUpdating } = useEntityDetailStore();
  const { isLoading, augmentedEntityData } = useEntityDetails({
    type,
    key: resetKey,
    queryParams,
    isFullScreenMode
  });

  const augmentedProperty = useEntityDetailStore((state) => state.augmentedEntityData?.properties);

  const entityProperties = augmentedProperty?.entityProperty;

  const augmentedEntityMetric = useEntityDetailStore((state) => state.augmentedEntityData?.metrics);
  const coreData = useEntityDetailStore((state) => state.coreData);

  return (
    <div data-testid="entitydetails-page" className={`${styles.container} ${customStyle}`}>
      {error ? (
        <ErrorPage error={error} />
      ) : (
        <>
          <VCard
            isLoading={isLoading}
            config={augmentedEntityData?.vcard}
            coreData={coreData}
            fieldValues={augmentedEntityData?.attributes?.fields}
          />
          <main className={styles.main}>
            <aside
              className={`${styles.properties} ${
                getStyle({ entityProperties, augmentedEntityMetric, isLoading })
                  ? styles.empty_properties_data
                  : ''
              }`}>
              {augmentedEntityMetric?.length ? <Metrics /> : null}
              <PropertiesWrapper
                newRelicEventName={EntityDetailsEvents.PrimaryContactRender}
                canLogEvent={canRenderAssociatedProperty(augmentedEntityData)}>
                <>
                  {canRenderAssociatedProperty(augmentedEntityData) ? (
                    <div className={styles.augmented_property}>
                      <AssociatedProperty
                        properties={
                          augmentedEntityData?.associatedLeadProperties as IPropertiesConfig
                        }
                        entityDetailsCoreData={coreData}
                      />
                    </div>
                  ) : null}
                </>
              </PropertiesWrapper>

              <PropertiesWrapper
                newRelicEventName={getPropertiesExpEventName(false)}
                canLogEvent={!!augmentedEntityData?.properties?.entityProperty?.length}>
                <>
                  {augmentedEntityData?.properties?.entityProperty?.length ? (
                    <Properties
                      type={type}
                      properties={augmentedEntityData?.properties}
                      entityDetailsCoreData={coreData}
                    />
                  ) : null}
                </>
              </PropertiesWrapper>

              <PropertiesWrapper
                newRelicEventName={getPropertiesExpEventName(true)}
                canLogEvent={
                  !!augmentedEntityData?.associatedEntityProperties?.entityProperty?.length
                }>
                <>
                  {augmentedEntityData?.associatedEntityProperties?.entityProperty?.length ? (
                    <Properties
                      type={type}
                      properties={augmentedEntityData?.associatedEntityProperties}
                      entityDetailsCoreData={coreData}
                      associatedEntityDetails={getAssociatedEntityDetails(
                        coreData,
                        augmentedEntityData
                      )}
                    />
                  ) : null}
                </>
              </PropertiesWrapper>
            </aside>
            {augmentedEntityData?.tabs.length ? (
              <EntityTabs
                coreData={coreData}
                config={augmentedEntityData?.tabs}
                isLoading={isLoading}
                isUpdating={isUpdating}
                customClassName={
                  getStyle({ entityProperties, augmentedEntityMetric, isLoading })
                    ? styles.spread_tab
                    : ''
                }
              />
            ) : null}
          </main>
        </>
      )}
    </div>
  );
};

EntityDetails.defaultProps = {
  queryParams: undefined
};

export default EntityDetails;
