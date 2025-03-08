import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { WEB_PROTOCOLS } from '../../constants';
import styles from './add-link.module.css';
import { lazy, useEffect, useRef } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const BaseInput = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/base-input')));

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

interface IBody {
  protocol: IOption;
  setProtocol: React.Dispatch<React.SetStateAction<IOption>>;
  link: string;
  setLink: React.Dispatch<React.SetStateAction<string>>;
}

const Body = (props: IBody): JSX.Element => {
  const { protocol, setProtocol, link, setLink } = props;
  const linkInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (linkInputRef.current && linkInputRef.current?.children?.[0]) {
        (linkInputRef.current?.children?.[0] as HTMLElement)?.focus();
      }
    }, 20);
  }, []);

  const handleProtocolUpdate = (newProtocol: IOption[]): void => {
    setProtocol(newProtocol[0]);
  };

  const handleLinkUpdate = (newLink: string): void => {
    if (newLink.startsWith('http://')) {
      setProtocol(WEB_PROTOCOLS[0]);
      newLink = newLink.replace('http://', '');
    } else if (newLink.startsWith('https://')) {
      setProtocol(WEB_PROTOCOLS[1]);
      newLink = newLink.replace('https://', '');
    } else if (newLink.startsWith('ftp://')) {
      setProtocol(WEB_PROTOCOLS[2]);
      newLink = newLink.replace('ftp://', '');
    } else if (newLink.startsWith('news://')) {
      setProtocol(WEB_PROTOCOLS[3]);
      newLink = newLink.replace('news://', '');
    }
    setLink(newLink);
  };

  return (
    <div className={styles.input_wrapper} data-testid="add-link-body">
      <div className={styles.protocol_wrapper}>
        <Dropdown
          fetchOptions={(): IOption[] => WEB_PROTOCOLS as IOption[]}
          setSelectedValues={handleProtocolUpdate}
          selectedValues={[protocol]}
          placeHolderText={WEB_PROTOCOLS[0].label}
          data-testid="add-link-protocol"
          hideClearButton
        />
      </div>
      <div className={styles.link_wrapper} ref={linkInputRef}>
        <BaseInput value={link} setValue={handleLinkUpdate} />
      </div>
    </div>
  );
};

export default Body;
