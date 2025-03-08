import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import styles from './entity-label.module.css';
import { getTitle } from './utils';

const Title = ({
  titleKeys,
  config,
  fallbackTitleKeys
}: {
  titleKeys: string[];
  config: IOption;
  fallbackTitleKeys: string[];
}): JSX.Element => {
  const title = getTitle({ titleKeys, config, fallbackTitleKeys });
  return (
    <div className={styles?.title} title={title}>
      {title}
    </div>
  );
};

export default Title;
