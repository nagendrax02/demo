import { CallerSource } from 'common/utils/rest-client';
import { IColumn, IRecordType } from '../smartview-tab/smartview-tab.types';
import { getAugmentedProperties } from '../../utils/augment';
import ProspectActivityCell from './prospect-activity-cell';
import { SCHEMA_NAMES } from '../../constants/constants';
import { EntityType } from 'common/types';
import { IAssociatedEntityDetails } from 'apps/entity-details/types/entity-data.types';
import { isPhoneCallActivity } from '../../augment-tab-data/activity/utils';
import FieldRenderer from 'v2/component-lib/field-renderer';
import AssociatedEntity from './associated-entity';

interface ICellRender {
  rowHeight?: string;
  columnDef: IColumn;
  record: IRecordType;
  isLastColumn?: boolean;
  canHaveEmptyValuesForFieldName?: boolean;
}

const CellRenderer = ({
  record,
  columnDef,
  rowHeight,
  isLastColumn,
  canHaveEmptyValuesForFieldName
}: ICellRender): JSX.Element => {
  if (columnDef.id === SCHEMA_NAMES.RELATED_ENTITY_ID) {
    return <AssociatedEntity record={record} />;
  }

  const augmentedProperties = getAugmentedProperties({
    record,
    columnDef,
    rowHeight,
    canHaveEmptyValuesForFieldName
  });

  const componentsBasedOnSchema = {
    ['ProspectActivityDate_Max']: (
      <ProspectActivityCell record={record}>
        <FieldRenderer
          property={augmentedProperties}
          fields={record}
          callerSource={CallerSource.SmartViews}
        />
      </ProspectActivityCell>
    ),
    ['P_ProspectActivityDate_Max']: (
      <ProspectActivityCell record={record}>
        <FieldRenderer
          property={augmentedProperties}
          fields={record}
          callerSource={CallerSource.SmartViews}
        />
      </ProspectActivityCell>
    ),
    ['ProspectActivityName_Max']: (
      <ProspectActivityCell record={record}>
        <FieldRenderer
          property={augmentedProperties}
          fields={record}
          callerSource={CallerSource.SmartViews}
        />
      </ProspectActivityCell>
    ),
    ['P_ProspectActivityName_Max']: (
      <ProspectActivityCell record={record}>
        <FieldRenderer
          property={augmentedProperties}
          fields={record}
          callerSource={CallerSource.SmartViews}
        />
      </ProspectActivityCell>
    )
  };
  const getOpportunityDetails = (): IAssociatedEntityDetails => ({
    entityId: record?.ProspectActivityId ?? '',
    entityType: EntityType.Opportunity,
    entityCode: record?.ActivityEvent ?? '',
    entityName: record?.mx_Custom_1 ?? ''
  });

  const getActivityDetails = (): IAssociatedEntityDetails => ({
    entityId: record?.ProspectActivityId ?? '',
    entityType: EntityType.Activity,
    entityCode: record?.ActivityEvent ?? '',
    entityName: record?.mx_Custom_1 ?? '',
    entityPhoneNumber: record?.Phone ?? '',
    entityFirstName: record?.FirstName ?? '',
    entityEmail: record?.EmailAddress ?? ''
  });

  const getAssociatedEntityDetails = (): IAssociatedEntityDetails | undefined => {
    if (record?.isOpportunity) {
      return getOpportunityDetails();
    }
    if (isPhoneCallActivity(record?.ActivityEvent || '')) {
      return getActivityDetails();
    }
  };
  const associatedEntityDetails = getAssociatedEntityDetails();

  return (
    <>
      {componentsBasedOnSchema[columnDef.id] ? (
        componentsBasedOnSchema[columnDef.id]
      ) : (
        <FieldRenderer
          fields={record}
          isLastColumn={isLastColumn}
          property={augmentedProperties}
          callerSource={CallerSource.SmartViews}
          preventDuplicateFiles
          associatedEntityDetails={associatedEntityDetails}
        />
      )}
    </>
  );
};

CellRenderer.defaultProps = {
  isLastColumn: false,
  canHaveEmptyValuesForFieldName: false
};

export default CellRenderer;
