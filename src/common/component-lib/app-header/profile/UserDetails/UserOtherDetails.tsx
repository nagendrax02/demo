import { Accounts, Call, Email } from 'assets/custom-icon/v2';
import styles from './user-deatils.module.css';
import { classNames } from 'common/utils/helpers/helpers';

const UserOtherDetails = (): JSX.Element => {
  const details = [
    {
      id: 1,
      icon: <Email type="outline" className={styles.user_email} />,
      info: 'taylorthegreat@gmail.com'
    },
    { id: 2, icon: <Call type="outline" className={styles.user_phone} />, info: '+91-9867545675' },
    {
      id: 3,
      icon: <Accounts type="outline" className={styles.user_company} />,
      info: 'Company Name'
    }
  ];
  return (
    <div className={classNames(styles.user_other_details, 'ng_v2_style')}>
      {details.map((detail) => (
        <div key={detail.id}>
          {detail.icon}
          <span className="ng_p_2_m">{detail.info}</span>
        </div>
      ))}
    </div>
  );
};

export default UserOtherDetails;
