import Icon from '@lsq/nextgen-preact/icon';
import styles from './email-fields.module.css';
import { lazy, useRef, useState } from 'react';
import useSendEmailStore from '../../send-email.store';
import EmailSelectMenu from '../email-select-menu';
import { IOption } from '../../send-email.types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DropdownRenderer = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown-renderer')));

const EmailFieldSelector = (): JSX.Element => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { emailConfig, fields, setFields } = useSendEmailStore();

  const handleClick = (): void => {
    setShowMenu((c) => !c);
  };

  const handleEmailFieldSelect = (option: IOption, selection: boolean): void => {
    const selectedEmailIndex = fields?.emailFields?.findIndex(
      (field) => field?.value === option?.value
    );
    if (selection && selectedEmailIndex === -1) {
      const temp = [...(fields?.emailFields || [])];
      temp.push(option);
      setFields({ emailFields: temp });
    } else if (!selection && selectedEmailIndex > -1) {
      const temp = [...(fields?.emailFields || [])];
      temp.splice(selectedEmailIndex, 1);
      setFields({ emailFields: temp });
    }
  };

  return (
    <>
      <div
        className={styles.email_feild_selector_container}
        onClick={handleClick}
        ref={containerRef}>
        <div className={styles.email_feild_selector_count}>{fields?.emailFields?.length}</div>
        <Icon
          name="arrow_drop_down"
          customStyleClass={`${styles.email_feild_selector_arrow} ${showMenu ? styles.open : ''}`}
        />
      </div>
      {containerRef?.current && showMenu ? (
        <DropdownRenderer
          parent={containerRef?.current}
          onOutsideClick={() => {
            setShowMenu(false);
          }}>
          <EmailSelectMenu
            options={emailConfig?.entityEmailFields || []}
            selectedOptions={fields.emailFields}
            onOptionSelect={handleEmailFieldSelect}
          />
        </DropdownRenderer>
      ) : null}
    </>
  );
};

export default EmailFieldSelector;
