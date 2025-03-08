import styles from './task-meta-info.module.css';

const User = ({ name, label }: { name: string; label: string }): JSX.Element => {
  return (
    <div>
      <span className={styles.task_info_title}>{label}</span>
      {name}
    </div>
  );
};

export default User;
