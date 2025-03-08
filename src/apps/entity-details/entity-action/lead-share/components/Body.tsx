import { IGroupedOption } from '../../../../../common/component-lib/grouped-option-dropdown';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { DEFAULT_MESSAGE_LENGTH } from '../constants';
import styles from '../lead-share.module.css';
import LeadShareDropdown from './LeadShareDropdown';

const TextArea = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/text-area')));

interface IBody {
  message: string;
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setSelectedUsers: React.Dispatch<React.SetStateAction<IGroupedOption[]>>;
  selectedUsers: IGroupedOption[];
}

const Body = (props: IBody): JSX.Element => {
  const { message, onMessageChange, setSelectedUsers, selectedUsers } = props;

  return (
    <div className={styles.body}>
      <div>
        <div className={styles.label}>
          Email To <span>*</span>
        </div>
        <LeadShareDropdown setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers} />
      </div>
      <br />
      <div>
        <div className={styles.label}>Notes</div>
        <TextArea
          message={message}
          handleMessageChange={onMessageChange}
          placeholder="Add Your Notes"
          customStyleClass={styles.text_area_container}
          maxLength={DEFAULT_MESSAGE_LENGTH}
        />
      </div>
    </div>
  );
};

export default Body;
