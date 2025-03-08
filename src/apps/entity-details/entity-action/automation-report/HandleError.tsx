import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from './automation.module.css';

interface IHandleError {
  representationName: string;
}

const HandleError = (props: IHandleError): JSX.Element => {
  const { representationName } = props;
  return (
    <div className={styles.error_container}>
      <div>
        <Icon name="error" customStyleClass={styles.error} variant={IconVariant.TwoTone} />
      </div>
      <div>This {representationName} is not part of any automation yet</div>
    </div>
  );
};

export default HandleError;
