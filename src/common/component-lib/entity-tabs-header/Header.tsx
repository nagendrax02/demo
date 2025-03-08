import styles from './header.module.css';

interface IHeader {
  children: JSX.Element;
}

const Header = (props: IHeader): JSX.Element => {
  const { children } = props;
  return (
    <div data-testid="entity-tabs-header" className={styles.header}>
      {children}
    </div>
  );
};

export default Header;
