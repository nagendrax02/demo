import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { CHAR_WORD_LIMIT } from 'common/constants';
import { extractHTMLContent, getPurifiedContent } from 'common/utils/helpers';
import { lazy, useEffect, useState } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ToolTip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

export interface ITextAdvanced {
  value: string;
  charLimit?: number;
  tooltipPlacement?: Placement;
}

const TextAdvanced = (props: ITextAdvanced): JSX.Element => {
  const { value, charLimit, tooltipPlacement = Placement.Horizontal } = props;
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    (async (): Promise<void> => {
      setHtmlContent(await getPurifiedContent(value || '', true));
    })();
  }, [value]);

  if (!value || typeof value !== 'string') return <></>;

  const textCharLimit = charLimit || CHAR_WORD_LIMIT;
  const extractedValue = extractHTMLContent(value);

  return (
    <ToolTip
      content={
        <div
          dangerouslySetInnerHTML={{
            // eslint-disable-next-line @typescript-eslint/naming-convention
            __html: htmlContent
          }}></div>
      }
      placement={tooltipPlacement}
      trigger={[Trigger.Hover]}>
      {extractedValue.length <= textCharLimit ? (
        <>{extractedValue}</>
      ) : (
        <span className="two-lines-ellipsis">
          {`${extractedValue.substring(0, textCharLimit)}...`}
        </span>
      )}
    </ToolTip>
  );
};

TextAdvanced.defaultProps = {
  charLimit: CHAR_WORD_LIMIT,
  tooltipPlacement: Placement.Horizontal
};

export default TextAdvanced;
