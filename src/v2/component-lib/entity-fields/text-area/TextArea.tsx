import { lazy, useEffect, useState } from 'react';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { Theme } from '@lsq/nextgen-preact/common/common.types';
import commonStyle from '../common-style.module.css';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

export interface ITextArea {
  value: string;
}
const TextArea = (props: ITextArea): JSX.Element => {
  const { value } = props;

  const [text, setText] = useState<string[]>(['']);

  useEffect(() => {
    let renderText = [''];
    if (!value) {
      renderText = [''];
    } else {
      renderText = value?.split('\n');
    }
    setText(renderText);
  }, [value]);

  return (
    <div data-testid="entity-field-textarea">
      <Tooltip
        content={value}
        placement={Placement.Vertical}
        trigger={[Trigger.Hover]}
        theme={Theme.Dark}>
        <div className={commonStyle.two_line_ellipsis}>
          {text.map((line, index) =>
            line ? (
              <>
                {line} {text.length - 1 != index ? <br /> : ''}
              </>
            ) : null
          )}
        </div>
      </Tooltip>
    </div>
  );
};

export default TextArea;
