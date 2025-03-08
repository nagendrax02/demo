import styles from './global-search.module.css';
import { ILeadRecord } from './global-search.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import {
  getEmailAddressStyle,
  getInitials,
  getName,
  getOverflowHandledName,
  getPhoneNumberStyle
} from './utils';
import { isMiP } from 'common/utils/helpers';
import { getLeadDetailsPath } from 'router/utils/entity-details-url-format';
import LeadActions from './LeadActions';

interface ILeadDropdown {
  records: ILeadRecord[];
  loading: boolean;
  debouncedValue: string;
  searchedText: string;
  closeSearch: () => void;
  openSearchResults: () => void;
}

const LeadDropdown = ({
  records,
  loading,
  debouncedValue,
  closeSearch,
  openSearchResults
}: ILeadDropdown): JSX.Element => {
  const recordsLength = records?.length;

  return (
    <div className={styles.dropdown_container}>
      {loading ? (
        <div className={styles.search_shimmer}>
          <Shimmer />
        </div>
      ) : null}
      {records?.splice(0, 6)?.map((item) => (
        <div className={styles.item_container} key={item?.ProspectID}>
          <a
            href={getLeadDetailsPath(item.ProspectID)}
            onClick={closeSearch}
            className={styles.record}>
            <div className={`${styles.profile_icon}`} data-testid="profile-img">
              <span>{getInitials(item)}</span>
            </div>
            <div className={styles.name} title={getName(item)}>
              {getOverflowHandledName(item)}
            </div>
            <div
              className={styles.contact_info + ' ' + styles.email_info}
              title={item?.EmailAddress}
              style={getEmailAddressStyle(item)}>
              {item?.EmailAddress}
            </div>
            {item?.EmailAddress && item?.Phone ? <div className={styles.seperator} /> : null}
            <div
              className={styles.contact_info}
              title={item?.Phone}
              style={getPhoneNumberStyle(item)}>
              {item?.Phone}
            </div>
          </a>
          {!isMiP() ? <LeadActions lead={item} /> : null}
        </div>
      ))}
      {!isMiP() && recordsLength > 6 ? (
        <div className={styles.view_results} onClick={openSearchResults}>
          View all results
        </div>
      ) : null}
      {debouncedValue.trim()?.length >= 3 && !loading && !recordsLength ? (
        <div className={styles.no_records}>No Records Found</div>
      ) : null}
    </div>
  );
};

export default LeadDropdown;
