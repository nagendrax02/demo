import { useEffect, useRef, useState } from 'react';
import styles from './add-link.module.css';
import { ADD_LINK_TITLE, WEB_PROTOCOLS } from '../../constants';
import Body from './Body';
import Footer from './Footer';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';

interface IAddLink {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: ({ url, openInNewTab }: { url: string; openInNewTab: boolean }) => void;
}

const AddLink = (props: IAddLink): JSX.Element => {
  const { setShow, onSubmit } = props;
  const addLinkRef = useRef<HTMLDivElement>(null);
  const [protocol, setProtocol] = useState<IOption>(WEB_PROTOCOLS[1]);
  const [link, setLink] = useState<string>('');
  const [openInNewTab, setOpenInNewTab] = useState<boolean>(false);

  const target = document.querySelector('[data-cmd="customAddLink"]')?.getBoundingClientRect();

  const handleOutsideClick = (event): void => {
    if (addLinkRef.current && !addLinkRef.current.contains(event.target)) {
      setShow(false);
    }
  };

  const handleSubmit = (): void => {
    if (link) {
      onSubmit({
        url: `${protocol.value}${link}`,
        openInNewTab
      });
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick, true);
    return (): void => {
      document.removeEventListener('click', handleOutsideClick, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={addLinkRef}
      className={styles.container}
      style={{ top: `${(target?.y || 0) + 25}px`, left: `${(target?.x || 0) - 327}px` }}
      data-testid="add-link-container">
      <div className={styles.title}>{ADD_LINK_TITLE}</div>
      <Body protocol={protocol} setProtocol={setProtocol} link={link} setLink={setLink} />
      <Footer
        openInNewTab={openInNewTab}
        setOpenInNewTab={setOpenInNewTab}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddLink;
