import styles from './activity-details-modal.module.css';
import { RenderType } from 'common/types/entity/lead/metadata.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { DateRenderType } from 'apps/entity-details/types/entity-data.types';
import SocialMedia from 'common/component-lib/entity-fields/social-media';
import UserName from 'common/component-lib/user-name';
import DateTime from 'common/component-lib/entity-fields/date-time';
import Text from 'common/component-lib/entity-fields/text';
import TextArea from 'common/component-lib/entity-fields/text-area';
import Link from 'common/component-lib/entity-fields/link';
import Boolean from 'common/component-lib/entity-fields/boolean';
import MultiSelect from 'common/component-lib/entity-fields/multi-select';
import Notes from 'common/component-lib/entity-fields/notes';
import { ActivityFile } from 'common/component-lib/entity-fields/file';
import { IActivityFields } from './activity-details.types';
import { getEntityId } from 'common/utils/helpers';
import { CallerSource } from 'src/common/utils/rest-client';
import { Placement } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import TextAdvanced from 'common/component-lib/entity-fields/text-advanced';
import Lead from '../../entity-fields/lead';

interface IValue {
  property: IActivityFields;
  callerSource: CallerSource;
  cfsSchemaName?: string;
  activityId: string;
  leadId?: string;
  entityId?: string;
  isLoading?: boolean;
  preventDuplicateFiles?: boolean;
}

const FieldRenderer = (props: IValue): JSX.Element => {
  const {
    property,
    isLoading,
    activityId,
    cfsSchemaName,
    leadId,
    callerSource,
    entityId,
    preventDuplicateFiles
  } = props;

  const componentsMapping = {
    [RenderType.Boolean]: <Boolean value={property.Value} />,
    [RenderType.RadioButtons]: <Boolean value={property.Value} />,
    [RenderType.Checkbox]: <Boolean value={property.Value} />,
    [RenderType.MultiSelect]: <MultiSelect value={property.Value} />,
    [RenderType.URL]: <Link link={property.Value} />,
    [RenderType.TextArea]: <TextArea value={property.Value} />,
    [RenderType.Datetime]: <DateTime date={property?.Value} renderType={DateRenderType.Datetime} />,
    [RenderType.DateTime]: <DateTime date={property?.Value} renderType={DateRenderType.Datetime} />,
    [RenderType.Time]: <DateTime date={property.Value} renderType={DateRenderType.Time} />,
    [RenderType.Date]: <DateTime date={property.Value} renderType={DateRenderType.Date} />,
    [RenderType.UserName]: <UserName id={property.Value} name={''} callerSource={callerSource} />,
    [RenderType.Lead]: <Lead leadId={property?.Value} displayValue={property?.DisplayValue} />,

    [RenderType.SocialMedia]: (
      <SocialMedia link={property.Value} schemaName={property.SchemaName} />
    ),
    [RenderType.HTML]: <Notes value={property.Value} showToolTip />,
    [RenderType.File]: (
      <ActivityFile
        property={property}
        leadId={leadId || getEntityId()}
        entityId={entityId}
        activityId={activityId}
        cfsSchemaName={cfsSchemaName}
        callerSource={callerSource}
        preventDuplicateFiles={preventDuplicateFiles}
      />
    ),
    [RenderType.String]: <Text value={property.Value} />,
    [RenderType.String1000]: (
      <TextAdvanced value={property.Value} tooltipPlacement={Placement.Vertical} />
    ),
    [RenderType.StringTextArea]: (
      <TextAdvanced value={property.Value} tooltipPlacement={Placement.Vertical} />
    ),
    [RenderType.StringCMS]: <Notes value={property.Value} showToolTip />
  };

  const getValue = (): JSX.Element | string => {
    if (property.SchemaName === 'Note' || property.SchemaName === 'ActivityEvent_Note') {
      return <Notes value={property.Value} showToolTip />;
    }

    return property.DataType && componentsMapping[property.DataType] ? (
      <>{componentsMapping[property.DataType]}</>
    ) : (
      <TextArea value={property.DisplayValue || property.Value} />
    );
  };

  return (
    <>
      {isLoading ? (
        <Shimmer className={styles.shimmer_value} />
      ) : (
        <div className={styles.value}>{getValue()}</div>
      )}
    </>
  );
};

FieldRenderer.defaultProps = {
  isLoading: false,
  cfsSchemaName: '',
  leadId: undefined,
  entityId: undefined
};

export default FieldRenderer;
