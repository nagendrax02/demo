import styles from './animated-tick.module.css';

const AnimatedTick = (): JSX.Element => {
  return (
    <svg className={`animated-tick ${styles.animation_svg}`}>
      <path
        d="M15,15 A10,10 0 1,1 71.56,71.56"
        className={`${styles.animation_path} ${styles.path1}`}
      />
      <path
        d="M71.56,71.56 A10,10 0 1,1 15,15"
        className={`${styles.animation_path} ${styles.path2}`}
      />
      <path d="M23,43 L38,56 66,28" className={`${styles.animation_path} ${styles.path3}`} />
    </svg>
  );
};

export default AnimatedTick;
