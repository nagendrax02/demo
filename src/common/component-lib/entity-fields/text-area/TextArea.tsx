import { TOOLTIP_CHAR_LIMIT_TEXTAREA, WORD_LIMIT } from 'common/constants';
import { lazy, useEffect, useState } from 'react';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import withSuspense from '@lsq/nextgen-preact/suspense';

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
      renderText =
        value?.length > WORD_LIMIT
          ? value?.substring(0, WORD_LIMIT)?.split('\n')
          : value?.split('\n');
    }
    setText(renderText);
  }, [value]);

  const getTextContent = (): JSX.Element => {
    return (
      <div data-testid="entity-field-textarea" className={`two-lines-ellipsis`}>
        {text.map((line, index) =>
          line ? (
            <>
              {line} {text.length - 1 != index ? <br /> : ''}
            </>
          ) : null
        )}
        {value?.length > WORD_LIMIT ? '...' : ''}
      </div>
    );
  };

  return (
    <>
      {value?.length > TOOLTIP_CHAR_LIMIT_TEXTAREA ? (
        <Tooltip content={value} placement={Placement.Vertical} trigger={[Trigger.Hover]}>
          {getTextContent()}
        </Tooltip>
      ) : (
        getTextContent()
      )}
    </>
  );
};

export default TextArea;
