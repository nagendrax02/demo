import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { CHAR_WORD_LIMIT } from 'common/constants';
import { RenderType, DataType } from 'common/types/entity/lead';
import { getTimezoneFullName } from 'common/constants/timezone-contants';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { decodeHtmlEntities } from '../utils';

const ToolTip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface IText {
  value: string;
  renderType?: RenderType | null;
  charLimit?: number;
  tooltipPlacement?: Placement;
  showAll?: boolean;
  preventAlignment?: boolean;
  dataType?: DataType | null;
}

// eslint-disable-next-line complexity
const Text = (props: IText): JSX.Element => {
  const {
    value,
    renderType,
    charLimit,
    tooltipPlacement = Placement.Horizontal,
    showAll,
    preventAlignment,
    dataType
  } = props;

  if (!value || typeof value !== 'string') return <></>;

  if (renderType && renderType === RenderType.TimeZone) {
    return <>{getTimezoneFullName(value)}</>;
  }

  const className = `${
    dataType === DataType.Number && !preventAlignment ? 'text-align-right' : ''
  } two-lines-ellipsis`;

  const textCharLimit = charLimit || CHAR_WORD_LIMIT;
  const decodedValue = decodeHtmlEntities(value);
  return (
    <>
      {decodedValue.length <= textCharLimit ? (
        <span className={className} title={value}>
          {decodedValue}
        </span>
      ) : (
        <ToolTip content={decodedValue} placement={tooltipPlacement} trigger={[Trigger.Hover]}>
          <span className={className}>
            {showAll ? decodedValue : `${decodedValue.substring(0, textCharLimit)}...`}
          </span>
        </ToolTip>
      )}
    </>
  );
};

Text.defaultProps = {
  renderType: null,
  charLimit: CHAR_WORD_LIMIT,
  tooltipPlacement: Placement.Horizontal,
  showAll: false,
  preventAlignment: false
};

export default Text;
