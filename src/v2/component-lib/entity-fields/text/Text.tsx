import { RenderType, DataType } from 'common/types/entity/lead';
import { getTimezoneFullName } from 'common/constants/timezone-contants';
import { decodeHtmlEntities } from '../utils';
import styles from './text.module.css';
import { classNames } from 'common/utils/helpers/helpers';
import commonStyle from '../common-style.module.css';

interface IText {
  value: string;
  renderType?: RenderType | null;
  dataType?: DataType | null;
}

// eslint-disable-next-line complexity
const Text = (props: IText): JSX.Element => {
  const { value, renderType, dataType } = props;

  if (!value || typeof value !== 'string') return <></>;

  if (renderType && renderType === RenderType.TimeZone) {
    const fullTimeZoneValue = getTimezoneFullName(value);
    return <div title={fullTimeZoneValue}>{fullTimeZoneValue}</div>;
  }

  const className = classNames(
    styles.content,
    commonStyle.ellipsis,
    dataType === DataType.Number ? 'text-align-right' : ''
  );

  const decodedValue = decodeHtmlEntities(value);
  return (
    <div className={className} title={value}>
      {decodedValue}
    </div>
  );
};

Text.defaultProps = {
  renderType: null
};

export default Text;
