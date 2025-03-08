import { CallerSource } from 'src/common/utils/rest-client';
import Name from './Name';
import Value from './Value';
import styles from './properties.module.css';
import { IBadgeConfig, IPropertiesConfig } from '../../types';
import { IEntityProperty, RenderType } from 'common/types/entity/lead/metadata.types';
import CustomFieldSet from 'common/component-lib/entity-fields/custom-field-set';
import { safeParseJson } from 'common/utils/helpers';
import { IEntityIds } from '../../types/entity-store.types';
import Badge from '../vcard/badge';
import { IAssociatedEntityDetails } from '../../types/entity-data.types';

interface IPropertyProps {
  properties: IPropertiesConfig;
  entityIds: IEntityIds;
  associatedEntityDetails?: IAssociatedEntityDetails;
}

const Property = (props: IPropertyProps): JSX.Element => {
  const { properties, entityIds, associatedEntityDetails } = props;

  const entityProperties = properties?.entityProperty;

  const field = properties?.fields;
  const config = properties?.entityConfig;

  const getValue = (prop: IEntityProperty): JSX.Element => {
    if (prop?.fieldRenderType === RenderType.OpportunityStatus) {
      const badgeConfig = prop?.componentConfig?.badgeConfig as IBadgeConfig;

      return (
        <div className={styles.component_wrapper}>
          <Badge config={badgeConfig} isLoading={false} />
        </div>
      );
    }

    return (
      <Value
        property={prop}
        fields={field}
        entityConfig={config}
        callerSource={CallerSource.LeadDetailsProperties}
        associatedEntityDetails={associatedEntityDetails}
      />
    );
  };

  const getProperty = (prop: IEntityProperty): JSX.Element => {
    if (prop?.fieldRenderType === RenderType.CustomObject) {
      return (
        <CustomFieldSet
          property={prop}
          fields={field}
          leadId={entityIds?.lead}
          opportunityId={entityIds?.opportunity}
          value={safeParseJson(prop?.value) || {}}
          customObjectMetaData={prop?.customObjectMetaData}
          isAssociatedLeadProperty={prop?.isAssociatedLeadProperty}
        />
      );
    }
    return (
      <div key={prop.id} className={styles.property}>
        <Name name={prop.name} />
        {getValue(prop)}
      </div>
    );
  };

  return (
    <div className={styles.property_box}>
      {entityProperties?.map((property) => {
        return getProperty(property);
      })}
    </div>
  );
};

Property.defaultProps = {
  associatedEntityDetails: undefined
};

export default Property;
