import { lazy, useEffect, useState } from 'react';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { extractHTMLContent, getPurifiedContent } from 'common/utils/helpers';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { Theme } from '@lsq/nextgen-preact/common/common.types';
import commonStyle from '../common-style.module.css';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface INotes {
  value: string;
}

const Notes = (props: INotes): JSX.Element => {
  const { value } = props;
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    (async (): Promise<void> => {
      const purifiedHTMLContent = await getPurifiedContent(value);
      setHtmlContent(purifiedHTMLContent);
    })();
  }, [value]);

  const htmlText = extractHTMLContent(htmlContent);

  return (
    <div data-testid="notes">
      <Tooltip
        content={
          <div
            dangerouslySetInnerHTML={{
              // eslint-disable-next-line @typescript-eslint/naming-convention
              __html: htmlContent
            }}></div>
        }
        theme={Theme.Dark}
        placement={Placement.Vertical}
        trigger={[Trigger.Hover]}>
        <div data-testid="notes-render" className={commonStyle.two_line_ellipsis}>
          {htmlText}
        </div>
      </Tooltip>
    </div>
  );
};

export default Notes;
