import {
  checkConnectorEmailOnS3,
  checkIsCustomEmail,
  getParsedActivityNote,
  getParsedMailBody
} from './utils';
import { connectEmailActivityKeys } from './constants';
import MailDetails from './MailDetails';
import { IAdditionalDetails } from 'apps/activity-history/types';
import Attachment from 'common/component-lib/activity-table/attachment';
import MetadataInfo from '../../../shared/metadata-info';
import { CallerSource } from 'common/utils/rest-client';

export interface IConnectorEmail {
  additionalDetails: IAdditionalDetails;
  activityName: string;
  activityId: string;
}

const ConnectorEmail = (props: IConnectorEmail): JSX.Element => {
  const { additionalDetails, activityName, activityId } = props;

  const {
    ActivityEvent_Note: activityEventNote = '',
    CreatedByName: createdByName = '',
    CreatedBy: createdById = ''
  } = additionalDetails || {};

  const eventNoteRecord = getParsedActivityNote(activityEventNote);
  const isConnectorEmail = checkIsCustomEmail(activityEventNote);
  const isConnectorEmailOnS3 = checkConnectorEmailOnS3(activityEventNote);
  const subject = eventNoteRecord?.[connectEmailActivityKeys.MAIL_SUBJECT] || '';

  const getBody = (): JSX.Element => {
    if (isConnectorEmail || isConnectorEmailOnS3) {
      const mailBody = eventNoteRecord?.[connectEmailActivityKeys.MAIL_BODY];
      const parsedMailBody = mailBody ? getParsedMailBody(mailBody) : '';
      return <span>{parsedMailBody}</span>;
    }
    return <></>;
  };

  return (
    <>
      {subject ? <span>{subject} </span> : <></>}
      {getBody()}
      <MailDetails
        activityName={activityName}
        createdByName={createdByName}
        eventNoteRecord={eventNoteRecord}
        isConnectorEmail={isConnectorEmail}
        isConnectorEmailOnS3={isConnectorEmailOnS3}
      />
      {additionalDetails?.HasAttachments === '1' ? (
        <Attachment activityId={activityId} callerSource={CallerSource.ActivityHistory} />
      ) : null}
      <MetadataInfo
        byLabel="Added by:"
        createdByName={createdByName}
        createdBy={createdById}
        callerSource={CallerSource.ActivityHistoryConnectorEmail}
      />
    </>
  );
};

export default ConnectorEmail;
