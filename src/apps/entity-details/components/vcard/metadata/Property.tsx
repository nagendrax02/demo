import { IMetaDataConfig } from '../../../types';
import styles from './metadata.module.css';

interface IProperty {
  field: IMetaDataConfig;
}

const Property = ({ field }: IProperty): JSX.Element => {
  if (field?.vCardDisplayName) {
    return <span className={styles.property}>{`${field?.vCardDisplayName || ''}:`}</span>;
  }
  return <></>;
};

export default Property;
