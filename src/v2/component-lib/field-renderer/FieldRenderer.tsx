import React from 'react';
import { trackError } from 'common/utils/experience/utils/track-error';
import { useState } from 'react';
import {
  IEntityProperty,
  RenderTypeCode,
  RenderType
} from 'common/types/entity/lead/metadata.types';
import styles from './field-renderer.module.css';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import SocialMedia from 'v2/component-lib/entity-fields/social-media';
import UserName from 'v2/component-lib/entity-fields/user-name';
import Phone from 'v2/component-lib/entity-fields/phone';
import DateTime from 'v2/component-lib/entity-fields/date-time';
import TextArea from 'v2/component-lib/entity-fields/text-area';
import Link from 'v2/component-lib/entity-fields/link';
import Boolean from 'v2/component-lib/entity-fields/boolean';
import MultiSelect from 'v2/component-lib/entity-fields/multi-select';
import Product from 'v2/component-lib/entity-fields/product';
import Notes from 'v2/component-lib/entity-fields/notes';
import Email from 'v2/component-lib/entity-fields/email';
import File from 'v2/component-lib/entity-fields/file';
import DueDate from 'v2/component-lib/entity-fields/due-date';
import Lead from 'v2/component-lib/entity-fields/lead';
import AudioPlayer from 'common/component-lib/audio-player';
import AccountName from 'v2/component-lib/entity-fields/account-name';
import { getUserName } from './utils';
import SendEmail from 'common/component-lib/send-email';
import { getEntityId } from 'common/utils/helpers';
import useEntityDetailStore, { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import { CallerSource } from 'common/utils/rest-client';
import Text from 'v2/component-lib/entity-fields/text';
import OpportunityStatus from 'v2/component-lib/entity-fields/opportunity-status';
import OpportunitySource from 'v2/component-lib/entity-fields/opportunity-source';
import OpportunityName from 'v2/component-lib/entity-fields/opportunity-name';
import TextAdvanced from 'v2/component-lib/entity-fields/text-advanced';
import PortalLink from 'v2/component-lib/entity-fields/portal-link';
import { PortalLinkTypes } from 'v2/component-lib/entity-fields/portal-link/portal-link.types';
import OppStatusHighlighted from 'v2/component-lib/entity-fields/opp-status-highlighted';
import MediaLink from 'common/component-lib/media-link';
import {
  DateRenderType,
  IAssociatedEntityDetails,
  IEntityDetailsCoreData
} from 'apps/entity-details/types/entity-data.types';
import { getEmailFieldTooltipContent } from 'apps/entity-details/utils/metadata-utils';
import { getLeadName, getUserId } from 'apps/entity-details/utils';
import { classNames } from 'common/utils/helpers/helpers';

interface IFieldRenderer {
  property: IEntityProperty;
  fields: Record<string, string | null> | undefined;
  callerSource: CallerSource;
  isLastColumn?: boolean;
  entityConfig?: { [key: string]: string | null } | undefined;
  isLoading?: boolean;
  preventDuplicateFiles?: boolean;
  entityDetailsCoreData?: IEntityDetailsCoreData | undefined;
  associatedEntityDetails?: IAssociatedEntityDetails;
}

// eslint-disable-next-line complexity, max-lines-per-function
const FieldRenderer = (props: IFieldRenderer): React.ReactNode => {
  const {
    property,
    isLoading,
    fields,
    callerSource,
    preventDuplicateFiles,
    entityDetailsCoreData,
    associatedEntityDetails
  } = props;

  const { entityIds } = entityDetailsCoreData || {};

  const [showSendEmail, setShowSendEmail] = useState<boolean>(false);
  const representationName = useLeadRepName();

  const augmentedAssociatedLeadProperties = useEntityDetailStore(
    (state) => state.augmentedEntityData?.associatedLeadProperties
  );
  const primaryContactLeadId = augmentedAssociatedLeadProperties?.fields?.PC_ProspectID || '';

  const handlePhoneNumberClick = async (): Promise<void> => {
    try {
      const module = await import('apps/external-app');
      module.triggerEntityClick2Call({
        fields,
        phoneNumber: property.value,
        schemaName: property.schemaName,
        associatedEntityDetails
      });
    } catch (error) {
      trackError(error);
    }
  };

  const handleEmailClick = (): void => {
    setShowSendEmail(true);
  };

  const getSocialMediaConfig = (): Record<string, boolean> => {
    const config = { renderIcon: true, renderLink: true };
    if (property?.renderConfig) {
      config.renderLink = property.renderConfig.renderLink as boolean;
    }
    return config;
  };

  const componentsMapping = {
    [RenderType.Boolean]: <Boolean value={property.value} schemaName={property?.schemaName} />,
    [RenderType.RadioButtons]: <Boolean value={property.value} schemaName={property?.schemaName} />,
    [RenderType.Checkbox]: <Boolean value={property.value} schemaName={property?.schemaName} />,
    [RenderType.MultiSelect]: <MultiSelect value={property.value} />,
    [RenderType.URL]: <Link link={property.value} schemaName={property.schemaName} />,
    [RenderType.TextArea]: <TextArea value={property.value} />,
    [RenderTypeCode.TextArea]: <TextArea value={property.value} />,
    [RenderType.Datetime]: (
      <DateTime
        date={property.value}
        renderType={DateRenderType.Datetime}
        timeFormat={property.timeFormat}
        schemaName={property?.schemaName}
      />
    ),
    [RenderType.DateTime]: (
      <DateTime
        date={property.value}
        renderType={DateRenderType.Datetime}
        timeFormat={property.timeFormat}
        schemaName={property?.schemaName}
      />
    ),
    [RenderType.DateWithTimezone]: (
      <DateTime
        date={property.value}
        renderType={DateRenderType.Datetime}
        dateTimeFormat={property.dateTimeFormat}
        schemaName={property?.schemaName}
      />
    ),
    [RenderType.Time]: (
      <DateTime
        date={property.value}
        renderType={DateRenderType.Time}
        schemaName={property?.schemaName}
      />
    ),
    [RenderType.Date]: (
      <DateTime
        date={property.value}
        renderType={DateRenderType.Date}
        schemaName={property?.schemaName}
        ignoreSystemTimeValue={property?.ignoreSystemTimeValue}
      />
    ),
    [RenderType.Phone]: (
      <Phone
        number={property.value}
        key={property.value + fields?.DoNotCall}
        doNotCall={fields?.DoNotCall === '1'}
        onClick={(): void => {
          handlePhoneNumberClick();
        }}
      />
    ),
    [RenderType.UserName]: (
      <UserName
        id={property.value}
        key={property.value}
        name={getUserName(property, fields)}
        callerSource={callerSource}
      />
    ),
    [RenderType.SocialMedia]: (
      <SocialMedia
        link={property.value}
        schemaName={property.schemaName}
        config={getSocialMediaConfig()}
      />
    ),
    [RenderType.HTML]: <Notes value={property.value} />,
    [RenderType.Product]: (
      <Product key={property.value} value={property.value} callerSource={callerSource} />
    ),
    [RenderType.Email]: (
      <Email
        emailId={property.value}
        onClick={(): void => {
          handleEmailClick();
        }}
        disabled={fields?.DoNotEmail === '1' || fields?.P_DoNotEmail === '1'}
        tooltipContent={getEmailFieldTooltipContent(fields)}
        entityAttributeType={property?.entityAttributeType}
      />
    ),
    [RenderType.File]: (
      <File
        property={property}
        leadId={
          property?.leadId ||
          fields?.ProspectID ||
          fields?.ProspectId ||
          entityIds?.lead ||
          entityDetailsCoreData?.entityIds?.lead ||
          ''
        }
        entityId={property?.entityId || ''}
        isActivity={property?.isActivity}
        callerSource={callerSource}
        removeDownloadOption={property?.removeDownloadOption}
        preventDuplicateFiles={preventDuplicateFiles}
      />
    ),
    [RenderType.DueDate]: <DueDate value={property?.value} timeFormat={property.timeFormat} />,
    [RenderType.Lead]: (
      <Lead leadId={property?.value} name={property.name} displayValue={property.displayValue} />
    ),
    //New Design not covered as not required for grid
    [RenderType.Audio]: <AudioPlayer fileURL={property?.value} enableDownload />,
    [RenderType.MediaLink]: (
      <MediaLink fileURL={property?.value} associatedEntityDetails={associatedEntityDetails} />
    ),
    [RenderType.TimeZone]: <Text value={property?.value} renderType={property.fieldRenderType} />,
    [RenderTypeCode.HTML]: <Notes value={property.value} />,
    [RenderType.AccountName]: (
      <AccountName name={property.name} id={property.id} schemaName={property.schemaName} />
    ),
    [RenderType.PrimaryContactName]: (
      <Lead
        leadId={primaryContactLeadId || (property?.config?.config?.id as string)}
        name={property.value}
      />
    ),
    [RenderType.AssociatedLead]: (
      <Lead leadId={property?.leadId || property?.entityId || ''} name={property.value} />
    ),
    //New Design not covered as not required for grid
    [RenderType.OpportunityStatus]: (
      <OpportunityStatus statusDataString={property?.additionalData?.status || ''} />
    ),
    //New Design not covered as not required for grid
    [RenderType.OpportunitySource]: (
      <OpportunitySource sourceDataString={property?.additionalData?.source || ''} />
    ),
    [RenderType.Account]: (
      <AccountName name={property.name} id={property.value} schemaName={property.schemaName} />
    ),
    [RenderType.OpportunityName]: (
      <OpportunityName
        oppId={property?.entityId || ''}
        eventCode={property?.eventCode || ''}
        name={property?.value}
      />
    ),
    [RenderType.String1000]: <TextAdvanced value={property.value} />,
    [RenderType.StringTextArea]: <TextAdvanced value={property.value} />,
    [RenderType.StringCMS]: <Notes value={property.value} />,
    [RenderType.PortalName]: (
      <PortalLink
        id={property?.value}
        displayName={property?.name}
        linkType={PortalLinkTypes.PortalName}
      />
    ),
    [RenderType.OppStatusHighlighted]: <OppStatusHighlighted property={property} />,
    [RenderType.FormName]: (
      <PortalLink
        id={property?.value}
        displayName={property?.name}
        linkType={PortalLinkTypes.FormName}
      />
    )
  };

  return (
    <>
      {showSendEmail ? (
        <SendEmail
          show
          setShow={setShowSendEmail}
          toLead={[{ label: getLeadName(fields), value: fields?.ProspectID ?? getEntityId() }]}
          fromUserId={getUserId()}
          leadRepresentationName={representationName}
          callerSource={CallerSource.LeadDetailsProperties}
          leadTypeInternalName={fields?.LeadType ?? fields?.P_LeadType ?? ''}
        />
      ) : null}

      {isLoading ? (
        <Shimmer className={styles.shimmer_value} />
      ) : (
        <div className={classNames('ng_p_1_m', styles.field_renderer_container)}>
          {componentsMapping[property.fieldRenderType] ? (
            componentsMapping[property.fieldRenderType]
          ) : (
            <Text value={`${property?.value ?? ''}`} dataType={property?.dataType} />
          )}
        </div>
      )}
    </>
  );
};

FieldRenderer.defaultProps = {
  isLoading: false,
  isLastColumn: false,
  entityConfig: undefined,
  preventDuplicateFiles: false
};

export default FieldRenderer;
