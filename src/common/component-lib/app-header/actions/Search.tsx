import { useState } from 'react';
import GlobalSearchV2 from '../../global-search-v2/GlobalSearchV2';
import SearchIcon from 'assets/custom-icon/v2/Search';
import styles from './actions.module.css';
import { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import { classNames } from '../../../utils/helpers';

const Search = (): JSX.Element => {
  const leadRepName = useLeadRepName();
  const [show, setShow] = useState<boolean>(false);

  const handleClick = (): void => {
    setShow((prev) => !prev);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={classNames(styles.action_button, styles.search_button_icon)}
        title={`Search ${leadRepName.PluralName}`}>
        <SearchIcon type="outline" />
      </button>
      {show ? <GlobalSearchV2 setShow={setShow} /> : null}
    </>
  );
};

export default Search;
