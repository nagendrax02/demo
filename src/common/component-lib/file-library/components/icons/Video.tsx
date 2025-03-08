import { IIcon } from '../../file-library.types';

const Video = (props: IIcon): JSX.Element => {
  const { width, height, color } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '24'}
      height={height || '24'}
      viewBox="0 0 24 24"
      fill="none">
      <path d="M0 0h24v24H0z" className="video-icon-svg-path" />
      <path
        d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"
        fill={color || '#D95140'}
      />
    </svg>
  );
};

export default Video;
