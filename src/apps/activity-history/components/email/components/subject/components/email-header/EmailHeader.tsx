import { IAugmentedEmailData, ICcBccOption } from '../../subject.type';
import CcBccFields from './CcBccFields';
import EmailInfo from './EmailInfo';
import FromUser from './FromUser';
import styles from './email-header.module.css';

interface IEmailHeader {
  data: IAugmentedEmailData;
}

const Label = {
  from: 'From',
  replyTo: 'Reply To',
  leads: 'Leads',
  users: 'Users',
  subject: 'Subject',
  category: 'Category',
  cc: 'Cc',
  bcc: 'Bcc'
};

const RenderCcBccFields = ({
  leads,
  users,
  label
}: {
  leads: (ICcBccOption | undefined)[] | undefined;
  users: (ICcBccOption | undefined)[] | undefined;
  label: string;
}): JSX.Element => {
  return (
    <>
      {leads?.length || users?.length ? (
        <EmailInfo
          label={label}
          title={
            <>
              <CcBccFields data={leads} label={Label.leads} />
              <CcBccFields data={users} label={Label.users} />
            </>
          }
        />
      ) : null}
    </>
  );
};

const EmailHeader = ({ data }: IEmailHeader): JSX.Element => {
  const ccLeads = data?.ccBccData.Cc?.Leads;
  const ccUsers = data?.ccBccData.Cc?.Users;
  const bccLeads = data?.ccBccData.Bcc?.Leads;
  const bccUsers = data?.ccBccData.Bcc?.Users;

  return (
    <div className={styles.email_header}>
      <EmailInfo
        label={Label.from}
        title={data?.fromUsername}
        subTitle={<FromUser id={data?.fromUserId} />}
      />
      <EmailInfo
        label={Label.replyTo}
        title={data?.replyTo?.name}
        subTitle={`(${data?.replyTo?.email})`}
      />
      <RenderCcBccFields leads={ccLeads} users={ccUsers} label={Label.cc} />
      <RenderCcBccFields leads={bccLeads} users={bccUsers} label={Label.bcc} />
      <EmailInfo label={Label.subject} title={data?.subject} />
      <EmailInfo label={Label.category} title={data?.category} />
    </div>
  );
};

export default EmailHeader;
