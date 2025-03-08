import styles from './body.module.css';

interface IRegisterOnPortal {
  portalUrl: string | undefined;
  portalDisplayName: string | undefined;
}

const RegisterOnPortal = (props: IRegisterOnPortal): JSX.Element => {
  const { portalUrl, portalDisplayName } = props;

  return (
    <>
      {portalDisplayName ? (
        <div>
          <a href={portalUrl} target="_blank" rel="noopener" className={styles.link}>
            {portalDisplayName}
          </a>
        </div>
      ) : null}
    </>
  );
};

export default RegisterOnPortal;
