import { useEffect, useRef } from 'react';
import { IPreviewData } from '../file-preview.types';
import styles from '../file-preview.module.css';
import { getApiUrl } from 'common/utils/helpers';
import { ENV_CONFIG } from 'common/constants';

interface IPdfPreviewer {
  previewData: IPreviewData;
  handleShimmer: () => void;
  handleError: (e) => void;
  isLoading: boolean;
}

const PdfPreviewer = (props: IPdfPreviewer): JSX.Element => {
  const { previewData, isLoading, handleShimmer, handleError } = props;

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = handleShimmer;
      iframe.onerror = handleError;
    }
    return () => {
      if (iframe) {
        iframe.onload = null;
        iframe.onerror = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title={previewData?.name ?? 'PDF-Preview'}
      data-testid="pdf-preview"
      style={{ display: isLoading ? 'none' : 'flex' }}
      className={styles.pdf}
      src={`${getApiUrl(
        ENV_CONFIG?.appDomain
      )}/pdf-previewer/web/viewer.html?file=${encodeURIComponent(previewData?.previewUrl)}`}
    />
  );
};

export default PdfPreviewer;
