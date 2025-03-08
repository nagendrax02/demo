import { FileTypes } from './file-preview.types';

const fileExtensions = {
  [FileTypes.Image]: ['jpeg', 'jpg', 'png', 'bmp'],
  [FileTypes.Pdf]: ['pdf'],
  [FileTypes.Audio]: ['mp3'],
  [FileTypes.Video]: ['mp4', 'mov', 'webm']
};

export { fileExtensions };
