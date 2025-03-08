export interface IAddTask {
  className?: string;
}

const AddTask = (props: IAddTask): JSX.Element | null => {
  const { className } = props;
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}>
      <path id="Path_7184" data-name="Path 7184" style={{ fill: 'none' }} d="M0,0H24V24H0Z" />
      <path
        id="Path_7185"
        data-name="Path 7185"
        d="M13.5,22.86H5.17a2,2,0,0,1-1.95-2V5A2,2,0,0,1,5.17,3H9.25a2.9,2.9,0,0,1,5.5,0h4.08a2,2,0,0,1,2,2V11.5h-2V5H16.88V8H7.12V5H5.17v15.9H13.5v2ZM12,3a1,1,0,1,0,1,1V4A1,1,0,0,0,12,3Z"
      />
      <polygon points="20.96 18.04 20.96 15 18.96 15 18.96 18.04 16 18.04 16 20.04 18.96 20.04 18.96 23 20.96 23 20.96 20.04 24 20.04 24 18.04 20.96 18.04" />
    </svg>
  );
};

AddTask.defaultProps = {
  className: ''
};

export default AddTask;
