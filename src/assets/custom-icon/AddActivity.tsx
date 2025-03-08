export interface IAddActivity {
  className?: string;
}

const AddActivity = (props: IAddActivity): JSX.Element | null => {
  const { className } = props;
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}>
      <path d="M10.33,21a1,1,0,0,1-.87-.51L5.89,14.11H2v-2H6.47a1,1,0,0,1,.88.51L10,17.39,13.81,3.73A1,1,0,0,1,14.69,3a1,1,0,0,1,1,.57l2.51,5.3H22v2H17.56a1,1,0,0,1-.91-.58L15,6.85,11.3,20.27a1,1,0,0,1-.85.72Z" />
      <polygon points="22.52 16.52 19.52 16.52 19.52 13.52 17.52 13.52 17.52 16.52 14.52 16.52 14.52 18.52 17.52 18.52 17.52 21.52 19.52 21.52 19.52 18.52 22.52 18.52 22.52 16.52" />
      <rect style={{ fill: 'none' }} width="24" height="24" />
    </svg>
  );
};

AddActivity.defaultProps = {
  className: ''
};

export default AddActivity;
