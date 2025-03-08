import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import TooltipContent from './status-change/TooltipContent';
import { EMPTY } from './status-change/constants';
import usePurifiedContent from './use-purified-content';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

interface IText {
  value: string | undefined;
  className?: string;
  tooltipContent?: string;
  onClick?: () => void;
}

const ToolTip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const Text = (props: IText): JSX.Element => {
  const { value, className, tooltipContent, onClick } = props;

  const purifiedContent = usePurifiedContent(value);

  const getClassName = (): string => {
    if (!className) return '';
    if (value === EMPTY) {
      return `${className} empty`;
    }
    return className;
  };

  const text = (
    <span
      className={getClassName()}
      dangerouslySetInnerHTML={{
        /* eslint-disable @typescript-eslint/naming-convention */
        __html: purifiedContent
      }}
      onClick={onClick}
    />
  );

  return (
    <>
      {tooltipContent ? (
        <ToolTip
          content={<TooltipContent tooltipContent={tooltipContent} />}
          placement={Placement.Vertical}
          trigger={[Trigger.Hover]}>
          {text}
        </ToolTip>
      ) : (
        text
      )}
    </>
  );
};

Text.defaultProps = {
  tooltipContent: '',
  className: '',
  onClick: undefined
};

export default Text;
