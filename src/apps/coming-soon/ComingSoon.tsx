import styles from './coming-soon.module.css';

const ComingSoon = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <img
        data-testid="image-preview"
        className={styles.image}
        src={'../../assets/coming-soon/ComingSoonImage.png'}
        onError={() => {}}
        alt=""
      />
      <div className={styles.coming_soon_text}>Coming Soon</div>
    </div>
  );
};

export default ComingSoon;
