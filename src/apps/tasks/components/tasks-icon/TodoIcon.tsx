const TodoIcon = (): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      data-testid="task-todo-icon"
      fill="rgb(var(--marvin-base))">
      <path d="M22,7H13V9h9Zm0,8H13v2h9ZM5.54,11,2,7.46,3.41,6.05,5.53,8.17,9.77,3.93l1.41,1.41Zm0,8L2,15.46l1.41-1.41,2.12,2.12,4.24-4.24,1.41,1.41Z" />
    </svg>
  );
};

export default TodoIcon;
