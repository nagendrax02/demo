import Icon from '@lsq/nextgen-preact/icon';
import styles from './file-icons.module.css';
import { Suspense, lazy } from 'react';

const Audio = lazy(() => import('./Audio'));
const Excel = lazy(() => import('./Excel'));
const Generic = lazy(() => import('./Generic'));
const Pdf = lazy(() => import('./Pdf'));
const Zip = lazy(() => import('./Zip'));
const Image = lazy(() => import('./Image'));
const Ppt = lazy(() => import('./Ppt'));
const Word = lazy(() => import('./Word'));

export interface IFileIcons {
  extension: string;
}

// eslint-disable-next-line complexity
const FileIcons = ({ extension }: IFileIcons): JSX.Element => {
  let icon = <Generic />;
  switch (extension.toLowerCase()) {
    case 'pdf':
      icon = <Pdf />;
      break;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'jfif':
    case 'pjpeg':
    case 'pjp':
      icon = <Image />;
      break;

    case 'ppt':
    case 'pptx':
      icon = <Ppt />;
      break;
    case 'docx':
    case 'doc':
      icon = <Word />;
      break;

    case 'xlsx':
      icon = <Excel />;
      break;

    case 'zip':
      icon = <Zip />;
      break;

    case 'mp3':
      icon = <Audio />;
      break;

    case 'mp4':
    case 'mov':
    case 'avi':
    case 'wmv':
    case 'avchd':
    case 'webm':
    case 'flv':
      icon = <Icon name="movie" customStyleClass={styles.movie_icon} />;
      break;

    default:
      icon = <Generic />;
  }

  return <Suspense fallback={<></>}>{icon}</Suspense>;
};

export default FileIcons;
