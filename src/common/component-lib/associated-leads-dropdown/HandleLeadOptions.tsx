import { IGetAugmentedLeadsArray } from './associated-lead-dropdown.types';
import styles from './associated-lead-dropdown.module.css';
import { getHeader } from 'common/utils/helpers/helpers';

const HandleLeadOptions = (props: IGetAugmentedLeadsArray): JSX.Element => {
  const { EmailAddress, Phone } = props;

  return (
    <div className={styles.custom_container}>
      <div className={styles.custom_header} title={getHeader(props as Record<string, string>)}>
        {getHeader(props as Record<string, string>)}
      </div>
      <div className={styles.custom_content}>
        <div className={styles.custom_label} title="Email Address">
          Email Address
        </div>
        <div className={styles.custom_value} title={EmailAddress}>
          {EmailAddress}
        </div>
      </div>
      <div className={styles.custom_content}>
        <div className={styles.custom_label} title="Phone Number">
          Phone Number
        </div>
        <div className={styles.custom_value} title={Phone}>
          {Phone}
        </div>
      </div>
    </div>
  );
};

export default HandleLeadOptions;
