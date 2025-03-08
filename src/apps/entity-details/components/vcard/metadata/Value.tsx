import { RenderType } from 'common/types/entity/lead';
import { IMetaDataConfig } from '../../../types';
import Link from 'common/component-lib/entity-fields/link';
import TextArea from 'common/component-lib/entity-fields/text-area';
import Email from 'common/component-lib/entity-fields/email';
import Phone from 'common/component-lib/entity-fields/phone';
import SocialMedia from 'common/component-lib/entity-fields/social-media';
import useEntityDetailStore, { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import {
  getLeadName,
  getTruncatedString,
  getUserId,
  handlePhoneNumberClick
} from 'apps/entity-details/utils';
import styles from './metadata.module.css';
import AccountName from 'common/component-lib/entity-fields/account-name';
import { getEmailFieldTooltipContent } from '../../../utils/metadata-utils';
import { lazy, useState } from 'react';
import SendEmail from 'common/component-lib/send-email';
import { getEntityId } from 'common/utils/helpers';
import { CallerSource } from 'common/utils/rest-client';
import { EntityType, Theme } from 'common/types';
import { getMetaDataTitle } from './utils';
import Lead from 'common/component-lib/entity-fields/lead';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { WORD_LIMIT } from 'common/constants';
import {
  DateRenderType,
  IAssociatedEntityDetails,
  IEntityDetailsCoreData
} from 'apps/entity-details/types/entity-data.types';
import DateTime from 'common/component-lib/entity-fields/date-time';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface IValue {
  field: IMetaDataConfig;
  coreData?: IEntityDetailsCoreData;
  fieldValues?: Record<string, string>;
  associatedEntityDetails?: IAssociatedEntityDetails;
}

const getValue = (value: string): JSX.Element => {
  if (value?.length < WORD_LIMIT) {
    return <>{value}</>;
  }
  return (
    <Tooltip content={value} placement={Placement.Vertical} trigger={[Trigger.Hover]}>
      <>{getTruncatedString(value)}</>
    </Tooltip>
  );
};

// eslint-disable-next-line complexity
const Value = ({ field, coreData, fieldValues, associatedEntityDetails }: IValue): JSX.Element => {
  const [showSendEmail, setShowSendEmail] = useState<boolean>(false);
  const { entityDetailsType = EntityType.Lead, entityIds, entityName } = coreData ?? {};
  const entityId = entityIds?.[entityDetailsType] || getEntityId();
  const fieldValuesFromStore = useEntityDetailStore(
    (state) => state.augmentedEntityData?.properties?.fields
  );

  const representationName = useLeadRepName();

  const componentsMapping = {
    [RenderType.URL]: <Link link={field?.Value} />,
    [RenderType.TextArea]: <TextArea value={field?.Value} />,
    [RenderType.Phone]: (
      <Phone
        number={field?.Value}
        doNotCall={fieldValuesFromStore?.DoNotCall === '1' || fieldValues?.P_DoNotCall === '1'}
        onClick={(): void => {
          handlePhoneNumberClick(
            fieldValues || fieldValuesFromStore,
            field,
            associatedEntityDetails
          );
        }}
        entityRepNames={coreData?.entityRepNames}
      />
    ),
    [RenderType.Email]: (
      <Email
        emailId={field?.Value}
        onClick={() => {
          setShowSendEmail(true);
        }}
        disabled={
          fieldValuesFromStore?.DoNotEmail === '1' ||
          fieldValuesFromStore?.P_DoNotEmail === '1' ||
          fieldValues?.P_DoNotEmail === '1'
        }
        tooltipContent={getEmailFieldTooltipContent(fieldValues || fieldValuesFromStore)}
        tooltipTheme={Theme.Light}
      />
    ),
    [RenderType.SocialMedia]: (
      <SocialMedia schemaName={field.SchemaName} link={field.Value} config={{ renderIcon: true }} />
    ),
    [RenderType.AccountName]: (
      <AccountName name={field.DisplayName} id={field.Value} schemaName={field?.SchemaName} />
    ),
    [RenderType.Component]: field?.JSXValue ? field?.JSXValue : <></>,
    [RenderType.Lead]: <Lead leadId={field?.Value} name={field?.DisplayName} showIcon />,
    [RenderType.Datetime]: <DateTime date={field?.Value} renderType={DateRenderType.Datetime} />,
    [RenderType.DateTime]: <DateTime date={field?.Value} renderType={DateRenderType.Datetime} />
  };

  const getFieldValue = (): JSX.Element => {
    return componentsMapping[field.RenderType] ? (
      <>{componentsMapping[field.RenderType]}</>
    ) : (
      <>{getValue(field.Value)}</>
    );
  };

  return (
    <>
      {showSendEmail ? (
        <SendEmail
          show
          setShow={setShowSendEmail}
          toLead={[
            {
              label: entityName || getLeadName(fieldValues || fieldValuesFromStore),
              value: entityId
            }
          ]}
          fromUserId={getUserId()}
          leadRepresentationName={representationName}
          callerSource={CallerSource.LeadDetailsVCard}
          leadTypeInternalName={fieldValues?.LeadType ?? fieldValues?.P_LeadType ?? ''}
        />
      ) : null}
      <div
        className={`${styles.value} ${field?.valueCustomStyleClass}`}
        title={getMetaDataTitle(field)}>
        {getFieldValue()}
      </div>
    </>
  );
};

Value.defaultProps = { coreData: {}, fieldValues: undefined };

export default Value;
