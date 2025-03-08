import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { extractHTMLContent, getPurifiedContent } from 'common/utils/helpers';
import { lazy, useEffect, useState } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { Theme } from '@lsq/nextgen-preact/common/common.types';
import commonStyle from '../common-style.module.css';

const ToolTip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

export interface ITextAdvanced {
  value: string;
}

const TextAdvanced = (props: ITextAdvanced): JSX.Element => {
  const { value } = props;
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    (async (): Promise<void> => {
      setHtmlContent(await getPurifiedContent(value || '', true));
    })();
  }, [value]);

  if (!value || typeof value !== 'string') return <></>;

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
      placement={Placement.Vertical}
      theme={Theme.Dark}
      trigger={[Trigger.Hover]}>
      <span className={commonStyle.two_line_ellipsis}>{extractedValue}</span>
    </ToolTip>
  );
};

export default TextAdvanced;
