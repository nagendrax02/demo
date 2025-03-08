export interface IAddSalesActivity {
  className?: string;
}

const AddSalesActivity = (props: IAddSalesActivity): JSX.Element | null => {
  const { className } = props;
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}>
      <path style={{ fill: 'none' }} d="M0,0H24V24H0Z" />
      <path d="M11,9h2V6h3V4H13V1H11V4H8V6h3ZM7,18a2,2,0,1,0,2,2A2,2,0,0,0,7,18Zm10,0a2,2,0,1,0,2,2A2,2,0,0,0,17,18ZM8.1,13h7.45a2,2,0,0,0,1.75-1l3.86-7L19.42,4l-3.87,7h-7L4.27,2H1V4H3l3.6,7.59L5.25,14A2,2,0,0,0,7,17H19V15H7Z" />
    </svg>
  );
};

AddSalesActivity.defaultProps = {
  className: ''
};

export default AddSalesActivity;
