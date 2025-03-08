import { trackError } from 'common/utils/experience/utils/track-error';
import { useState } from 'react';
import { IEntityProperty } from 'common/types/entity/lead/metadata.types';
import styles from './properties.module.css';
import { RenderType } from 'common/types/entity/lead/metadata.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import {
  DateRenderType,
  IAssociatedEntityDetails,
  IEntityDetailsCoreData
} from '../../types/entity-data.types';
import SocialMedia from 'common/component-lib/entity-fields/social-media';
import UserName from 'common/component-lib/user-name';
import Phone from 'common/component-lib/entity-fields/phone';
import DateTime from 'common/component-lib/entity-fields/date-time';
import TextArea from 'common/component-lib/entity-fields/text-area';
import Link from 'common/component-lib/entity-fields/link';
import Boolean from 'common/component-lib/entity-fields/boolean';
import MultiSelect from 'common/component-lib/entity-fields/multi-select';
import Product from 'common/component-lib/entity-fields/product';
import Notes from 'common/component-lib/entity-fields/notes';
import Email from 'common/component-lib/entity-fields/email';
import File from 'common/component-lib/entity-fields/file';
import DueDate from 'common/component-lib/entity-fields/due-date';
import Lead from 'common/component-lib/entity-fields/lead';
import AudioPlayer from 'common/component-lib/audio-player';
import AccountName from 'common/component-lib/entity-fields/account-name';
import { getUserName } from './utils';
import { getEmailFieldTooltipContent } from '../../utils/metadata-utils';
import SendEmail from 'common/component-lib/send-email';
import { getLeadName, getUserId } from '../../utils';
import { getEntityId } from 'common/utils/helpers';
import useEntityDetailStore, { useLeadRepName } from '../../entitydetail.store';
import { CallerSource } from 'common/utils/rest-client';
import { Placement } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import Text from 'common/component-lib/entity-fields/text';
import { CHAR_WORD_LIMIT } from 'common/constants';
import OpportunityStatus from 'common/component-lib/entity-fields/opportunity-status';
import OpportunitySource from 'common/component-lib/entity-fields/opportunity-source';
import { RenderTypeCode } from 'common/component-lib/bulk-update/bulk-update.types';
import OpportunityName from 'common/component-lib/entity-fields/opportunity-name';
import TextAdvanced from 'common/component-lib/entity-fields/text-advanced';
import PortalLink from 'common/component-lib/entity-fields/portal-link';
import { PortalLinkTypes } from 'common/component-lib/entity-fields/portal-link/portal-link.types';
import OppStatusHighlighted from 'common/component-lib/entity-fields/opp-status-highlighted';
import MediaLink from 'common/component-lib/media-link';

interface IValue {
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
const Value = (props: IValue): JSX.Element => {
  const {
    property,
    isLoading,
    fields,
    callerSource,
    isLastColumn,
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
    // to do implement onclick
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
    [RenderType.HTML]: <Notes value={property.value} showToolTip />,
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
    [RenderType.Audio]: <AudioPlayer fileURL={property?.value} enableDownload />,
    [RenderType.MediaLink]: (
      <MediaLink fileURL={property?.value} associatedEntityDetails={associatedEntityDetails} />
    ),
    [RenderType.TimeZone]: <Text value={property?.value} renderType={property.fieldRenderType} />,
    [RenderTypeCode.HTML]: <Notes value={property.value} showToolTip />,
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
    [RenderType.OpportunityStatus]: (
      <OpportunityStatus statusDataString={property?.additionalData?.status || ''} />
    ),
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
    [RenderType.String1000]: (
      <TextAdvanced value={property.value} tooltipPlacement={Placement.Vertical} />
    ),
    [RenderType.StringTextArea]: (
      <TextAdvanced value={property.value} tooltipPlacement={Placement.Vertical} />
    ),
    [RenderType.StringCMS]: <Notes value={property.value} showToolTip />,
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
        <div className={styles.property_value}>
          {componentsMapping[property.fieldRenderType] ? (
            componentsMapping[property.fieldRenderType]
          ) : (
            <Text
              value={`${property?.value ?? ''}`}
              charLimit={
                property?.isRenderedInGrid ? property?.charLimit ?? CHAR_WORD_LIMIT : undefined
              }
              showAll={property?.showAll}
              tooltipPlacement={isLastColumn ? Placement.Horizontal : Placement.Vertical}
              preventAlignment={property?.preventAlignment}
              dataType={property?.dataType}
            />
          )}
        </div>
      )}
    </>
  );
};

Value.defaultProps = {
  isLoading: false,
  isLastColumn: false,
  entityConfig: undefined,
  preventDuplicateFiles: false
};

export default Value;
