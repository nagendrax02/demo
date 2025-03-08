import styles from './add-link.module.css';
import Checkbox from '@lsq/nextgen-preact/checkbox';
import { Variant } from 'common/types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

interface IFooter {
  openInNewTab: boolean;
  setOpenInNewTab: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: () => void;
}

const Footer = (props: IFooter): JSX.Element => {
  const { openInNewTab, setOpenInNewTab, handleSubmit } = props;

  const handleNewTabClick = (): void => {
    setOpenInNewTab((prevValue) => !prevValue);
  };

  return (
    <div className={styles.footer} data-testid="add-link-footer">
      <div className={styles.checkbox_wrapper}>
        <Checkbox checked={openInNewTab} changeSelection={handleNewTabClick} />
        <label>Open in new tab</label>
      </div>
      <Button
        text={'Insert'}
        variant={Variant.Primary}
        onClick={handleSubmit}
        customStyleClass={styles.insert_button}
      />
    </div>
  );
};

export default Footer;
