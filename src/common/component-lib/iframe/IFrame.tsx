import { useCallback, useRef } from 'react';
import { getSrc } from './utils';
import Spinner from '@lsq/nextgen-preact/spinner';
import styles from './iframe.module.css';
import { IOnLoad } from './iframe.types';

export interface IIFrame {
  id: string;
  src: string;
  srcDoc?: string;
  augmentSrc?: boolean;
  showSpinner?: boolean;
  attributes?: Record<string, string>;
  setShowSpinner?: (show: boolean) => void;
  width?: string;
  height?: string;
  onLoad?: (onLoadConfig: IOnLoad) => void;
  customRef?: React.RefObject<HTMLIFrameElement>;
  customStyleClass?: string;
  inlineStyle?: Record<string, string>;
  title?: string;
}
// eslint-disable-next-line complexity
const IFrame = (props: IIFrame): JSX.Element => {
  const {
    id,
    attributes,
    showSpinner,
    setShowSpinner,
    width,
    height,
    onLoad,
    augmentSrc,
    src,
    srcDoc,
    customRef,
    customStyleClass,
    inlineStyle,
    title
  } = props;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const handleOnLoad = useCallback((): void => {
    if (onLoad) {
      onLoad({ iframeRef });
    }
    if (setShowSpinner) setShowSpinner(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSpinner]);

  return (
    <>
      {showSpinner ? <Spinner customStyleClass={styles.spinner} /> : null}
      {src?.trim() || srcDoc ? (
        <iframe
          id={id}
          srcDoc={srcDoc}
          src={augmentSrc ? getSrc(src) : src?.trim()}
          {...attributes}
          onLoad={handleOnLoad}
          className={`${styles.iframe} ${customStyleClass || ''} ${showSpinner ? styles.hide : ''}`}
          data-testid="iframe"
          title={title}
          width={width}
          height={height}
          ref={customRef ?? iframeRef}
          style={inlineStyle}
        />
      ) : null}
    </>
  );
};

IFrame.defaultProps = {
  style: {},
  attributes: {},
  augmentSrc: true,
  srcDoc: undefined,
  showSpinner: false,
  setShowSpinner: undefined,
  width: undefined,
  height: undefined,
  onLoad: undefined,
  customRef: null,
  customStyleClass: '',
  title: '',
  inlineStyle: {}
};

export default IFrame;
