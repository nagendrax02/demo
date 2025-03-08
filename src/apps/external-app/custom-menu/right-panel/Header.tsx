import { ICustomMenu } from '../custom-menu.types';
import styles from './styles.module.css';
import TooltipWrapper from './TooltipWrapper';

const Header = ({ selectedMenu }: { selectedMenu: ICustomMenu }): JSX.Element => {
  const appConfig = selectedMenu.AppConfig;
  return (
    <div className={styles.header_wrapper}>
      <div className={styles.title_container}>
        <div className={styles.title}>{appConfig?.Title}</div>
        <TooltipWrapper
          icon={'help'}
          message={<>Help Documentation for this page</>}
          url={appConfig?.HelpURL || ''}
        />
        <TooltipWrapper
          icon={'play_circle_filled'}
          message={
            <div>
              <div className={styles.help_text_title}>Video Tutorial</div>
              <div className={styles.help_text_desc}>
                Click here to see the video tour of, how to use this page
              </div>
            </div>
          }
          url={appConfig?.VideoURL || ''}
        />
      </div>
      {appConfig?.Description ? (
        <div className={styles.description}>{appConfig.Description}</div>
      ) : null}
    </div>
  );
};

export default Header;
