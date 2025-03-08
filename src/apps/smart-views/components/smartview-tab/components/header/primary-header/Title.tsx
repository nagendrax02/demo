import styles from './primary-header.module.css';

const Title = ({ title, customStyle }: { title: string; customStyle: string }): JSX.Element => {
  return (
    <h1 className={`${styles.header_title} ${customStyle}`} title={title}>
      {title}
    </h1>
  );
};

export default Title;
