import useFileLibraryStore from '../../file-library.store';
import Header from './header';
import Body from './body';
import Footer from './footer';
import styles from './right-panel.module.css';
import AccessDenied from '../access-denied';

const RightPanel = (): JSX.Element => {
  const { showFooter, viewRestricted } = useFileLibraryStore((state) => ({
    showFooter: state.showFooter,
    viewRestricted: state.viewRestricted
  }));

  return (
    <>
      {viewRestricted ? (
        <AccessDenied />
      ) : (
        <div className={styles.right_panel}>
          <Header />
          <Body />
          {showFooter ? <Footer /> : null}
        </div>
      )}
    </>
  );
};

export default RightPanel;
