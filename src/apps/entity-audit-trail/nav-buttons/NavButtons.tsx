import Icon from '@lsq/nextgen-preact/icon';
import IconButton from 'common/component-lib/icon-button';
import styles from './nav-buttons.module.css';
import useAuditTrailStore from '../entity-audit-trail.store';
import { useEffect, useState } from 'react';

const NavButtons = (): JSX.Element => {
  const { fetchCriteria, filters, setFetchCriteria } = useAuditTrailStore();

  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState<boolean>(false);
  const [isPrevButtonDisabled, setIsPrevButtonDisabled] = useState<boolean>(false);

  const getIsPrevButtonDisabled = (): boolean => {
    return fetchCriteria?.pageNumber === 0;
  };

  const getIsNextButtonDisabled = (): boolean => {
    if (!filters?.typeFilter?.filterOptions?.length) return true;
    const nextPageStartingCount = fetchCriteria?.pageCountArray?.[fetchCriteria?.pageNumber + 1];
    if (!nextPageStartingCount || nextPageStartingCount >= fetchCriteria?.totalRecordCount)
      return true;
    return false;
  };

  useEffect(() => {
    setIsNextButtonDisabled(getIsNextButtonDisabled());
    setIsPrevButtonDisabled(getIsPrevButtonDisabled());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, fetchCriteria]);

  const onPrevClick = (): void => {
    window.scrollTo(0, 0);
    setFetchCriteria({ pageNumber: fetchCriteria?.pageNumber - 1 });
  };
  const onNextClick = (): void => {
    window.scrollTo(0, 0);
    setFetchCriteria({ pageNumber: fetchCriteria?.pageNumber + 1 });
  };

  return (
    <div className={styles.footer}>
      <div className={styles.button_wrapper}>
        <IconButton
          id="prev_button"
          onClick={onPrevClick}
          icon={<Icon name="chevron_right" />}
          customStyleClass={`${styles.button} ${styles.left_button}`}
          disabled={isPrevButtonDisabled}
        />
        <IconButton
          id="next_button"
          onClick={onNextClick}
          icon={<Icon name="chevron_right" />}
          customStyleClass={styles.button}
          disabled={isNextButtonDisabled}
        />
      </div>
    </div>
  );
};

export default NavButtons;
