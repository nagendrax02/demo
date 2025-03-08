type Props = {
  className?: string;
};

const EditTask = (props: Props): JSX.Element => {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={22}
      viewBox="0 0 22 22"
      className={className}>
      <path d="M6.26,20H3V4H5V7H15V4h2V6.75l.69-.69A3.64,3.64,0,0,1,19,5.23V4a2,2,0,0,0-2-2H12.82A3,3,0,0,0,7.18,2H3A2,2,0,0,0,1,4V20a2,2,0,0,0,2,2H6.26ZM10,2A1,1,0,1,1,9,3,1,1,0,0,1,10,2Z" />
      <path d="M17,19.25V20h-.75l-2,2H17a2,2,0,0,0,2-2V17.25Z" />
      <polygon points="16.81 9.77 8.26 18.32 8.26 21.75 11.68 21.75 20.23 13.19 16.81 9.77" />
      <path d="M18,8.62,19.1,7.47a1.61,1.61,0,0,1,2.28,0l1.15,1.15a1.61,1.61,0,0,1,0,2.28L21.38,12Z" />
    </svg>
  );
};

EditTask.defaultProps = {
  className: ''
};

export default EditTask;
