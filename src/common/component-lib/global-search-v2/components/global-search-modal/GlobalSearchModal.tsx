import { ReactNode, useEffect } from 'react';
import styles from './global-search-modal.module.css';
import { classNames } from 'common/utils/helpers/helpers';

interface IGlobalSearchModalProps {
  handleClose: () => void;
  children: ReactNode;
}

const GlobalSearchModal = ({
  handleClose,
  children
}: IGlobalSearchModalProps): JSX.Element | null => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'initial';
    };
  }, []);

  return (
    <button
      className={classNames(styles.search_wrapper, 'ng_v2_style')}
      onClick={handleClose}
      tabIndex={-1}>
      <button
        className={styles.search_container}
        onClick={(e) => {
          e.stopPropagation();
        }}>
        {children}
      </button>
    </button>
  );
};

export default GlobalSearchModal;
