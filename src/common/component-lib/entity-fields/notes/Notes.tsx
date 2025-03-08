import { lazy, useEffect, useState } from 'react';
import { WORD_LIMIT } from 'common/constants';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { extractHTMLContent, getPurifiedContent } from 'common/utils/helpers';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface INotes {
  value: string;
  showToolTip: boolean;
}

const Notes = (props: INotes): JSX.Element => {
  const { value, showToolTip } = props;
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    (async (): Promise<void> => {
      const purifiedHTMLContent = await getPurifiedContent(value);
      setHtmlContent(purifiedHTMLContent);
    })();
  }, [value]);

  const htmlText = extractHTMLContent(htmlContent);

  const renderContent = (): string => {
    if (htmlText?.length < WORD_LIMIT) {
      return htmlText;
    }
    return `${htmlText.substring(0, WORD_LIMIT)}...`;
  };

  return (
    <div data-testid="notes">
      {value?.length <= WORD_LIMIT && !showToolTip ? (
        <div>{htmlText}</div>
      ) : (
        <Tooltip
          content={
            <div
              dangerouslySetInnerHTML={{
                // eslint-disable-next-line @typescript-eslint/naming-convention
                __html: htmlContent
              }}></div>
          }
          placement={Placement.Vertical}
          trigger={[Trigger.Hover]}>
          <div data-testid="notes-render" className={`two-lines-ellipsis`}>
            {renderContent()}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default Notes;
