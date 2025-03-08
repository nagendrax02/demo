import styles from './task-body.module.css';

const Description = ({ description }: { description: string }): JSX.Element => {
  return description ? (
    <div className={styles.description}>
      <div>{description}</div>
    </div>
  ) : (
    <></>
  );
};

export default Description;
