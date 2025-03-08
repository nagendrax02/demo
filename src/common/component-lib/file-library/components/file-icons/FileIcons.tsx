import { Image, PPT, Word, PDF, Zip, Excel, Audio, Video, Generic } from '../icons';

interface IFileIcons {
  extension: string;
  height?: string;
  width?: string;
}

const FileIcons = ({ extension, height, width }: IFileIcons): JSX.Element => {
  // eslint-disable-next-line complexity
  const getFileIcons = (): JSX.Element => {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return <PDF height={height} width={width} />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'jfif':
      case 'pjpeg':
      case 'pjp':
        return <Image height={height} width={width} />;
      case 'ppt':
      case 'pptx':
        return <PPT height={height} width={width} />;
      case 'docx':
      case 'doc':
        return <Word height={height} width={width} />;
      case 'xlsx':
        return <Excel height={height} width={width} />;
      case 'zip':
        return <Zip height={height} width={width} />;
      case 'mp3':
        return <Audio height={height} width={width} />;
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'wmv':
      case 'avchd':
      case 'webm':
      case 'flv':
        return <Video height={height} width={width} />;
      default:
        return <Generic height={height} width={width} />;
    }
  };

  return <div className="file-icons">{getFileIcons()}</div>;
};

FileIcons.defaultProps = {
  height: '',
  width: ''
};

export default FileIcons;
