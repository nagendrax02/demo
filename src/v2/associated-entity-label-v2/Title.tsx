import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import styles from './entity-label.module.css';
import { getTitle } from './utils';
import { classNames } from 'common/utils/helpers/helpers';

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
    <div className={classNames(styles.title, 'ng_p_1_sb', styles.text_overflow)} title={title}>
      {title}
    </div>
  );
};

export default Title;
