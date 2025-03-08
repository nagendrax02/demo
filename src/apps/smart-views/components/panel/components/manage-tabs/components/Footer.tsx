import { Variant } from 'common/types';
import styles from '../manage-tabs.module.css';
import { FooterText } from 'apps/smart-views/components/panel/constants';
import { useState, lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

interface IFooter {
  onCancel: () => void;
  onSave: () => Promise<void>;
}

const Footer = (props: IFooter): JSX.Element => {
  const { onCancel, onSave } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (): Promise<void> => {
    setIsLoading(true);
    await onSave();
    setIsLoading(false);
  };

  return (
    <div className={styles.footer}>
      <Button text={FooterText.cancel} onClick={onCancel} />
      <Button
        text={FooterText.save}
        onClick={handleSave}
        variant={Variant.Primary}
        isLoading={isLoading}
        disabled={isLoading}
      />
    </div>
  );
};

export default Footer;
