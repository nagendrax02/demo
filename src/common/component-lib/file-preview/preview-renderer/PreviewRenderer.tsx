import { useState } from 'react';
import AudioPlayer from 'common/component-lib/audio-player';
import { getFileType } from '../utils';
import { FileTypes, IPreviewData } from '../file-preview.types';
import styles from '../file-preview.module.css';
import Spinner from '@lsq/nextgen-preact/spinner';
import PreviewError from '../preview-error';
import VideoPlayer from 'common/component-lib/video-player';
import PdfPreviewer from 'common/component-lib/file-preview/pdf-previewer';

interface IPreviewRenderer {
  previewData: IPreviewData;
}

const PreviewRenderer = ({ previewData }: IPreviewRenderer): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const fileType = getFileType(previewData);

  const handleShimmer = (): void => {
    setIsLoading(false);
  };

  const handleError = (e): void => {
    e.stopPropagation();
    setError(true);
    setIsLoading(false);
  };

  const getFilePreview = {
    [FileTypes.Image]: () => (
      <>
        {isLoading ? <Spinner /> : null}
        {!error ? (
          <img
            data-testid="image-preview"
            style={{ display: isLoading ? 'none' : 'flex' }}
            onLoad={handleShimmer}
            className={styles.image}
            src={previewData.previewUrl}
            onError={handleError}
            alt=""
          />
        ) : (
          <PreviewError previewData={previewData} />
        )}
      </>
    ),
    [FileTypes.Pdf]: () => (
      <>
        {isLoading ? <Spinner /> : null}
        {!error ? (
          <PdfPreviewer
            isLoading={isLoading}
            previewData={previewData}
            handleShimmer={handleShimmer}
            handleError={handleError}
          />
        ) : (
          <PreviewError previewData={previewData} />
        )}
      </>
    ),
    [FileTypes.Audio]: () => (
      <div className={styles.audio_player}>
        <AudioPlayer
          fileURL={previewData?.previewUrl}
          enableDownload={!previewData.restrictDownload}
        />
      </div>
    ),
    [FileTypes.Video]: () => (
      <div className={styles.audio_player}>
        <VideoPlayer
          fileUrl={previewData?.previewUrl}
          enableDownload={!previewData.restrictDownload}
        />
      </div>
    )
  };

  if (fileType && getFilePreview[fileType]) {
    return <>{getFilePreview[fileType]()}</>;
  }
  return <PreviewError previewData={previewData} />;
};

export default PreviewRenderer;
