import { useCallback, useEffect, useRef, useState } from 'react';
import FroalaEditor from 'react-froala-wysiwyg';
import Froalaeditor from 'froala-editor';

import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
require('./basic-editor.css');

// toolbar plugins
import 'froala-editor/js/plugins/lists.min';
import 'froala-editor/js/plugins/link.min';
import 'froala-editor/js/plugins/char_counter.min';
import 'froala-editor/js/plugins/url.min';

// for icons
import { initializeTools } from '../utils/custom-icons';

import { BASIC_TOOLBAR, LICENSE_KEY } from '../constants';
import { AddLink } from '../tools';
import { getNewURL } from '../utils/common';
import { showErrorMessageIfCountExceeded } from '../utils/editor';

export interface IBasicEditor {
  value: string;
  onValueChange: (htmlString: string) => void;
  placeholderText?: string;
  maxCharLimit?: number;
}

const BasicEditor = ({
  value,
  onValueChange,
  placeholderText,
  maxCharLimit
}: IBasicEditor): JSX.Element => {
  initializeTools();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const froalaRef = useRef<any>({ editor: undefined });
  const [showAddLink, setShowAddLink] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');

  const handleFocus = (): void => {
    const textArea = document.getElementsByClassName('fr-element')?.[0] as HTMLElement;
    if (textArea) {
      textArea.focus();
    }
  };

  useEffect(() => {
    if (froalaRef?.current) {
      handleFocus();
    }
  }, []);

  const handleModelChange = useCallback(
    (event) => {
      const charCounterMax = maxCharLimit ?? -1;
      if (charCounterMax > 0) {
        showErrorMessageIfCountExceeded(
          froalaRef?.current?.editor?.charCounter?.count() >= charCounterMax
        );
      }
      onValueChange(event);
    },
    [onValueChange]
  );

  return (
    <div className="container" data-testid="marvin-froala-basic-editor">
      {showAddLink ? (
        <AddLink
          setShow={setShowAddLink}
          onSubmit={({ url, openInNewTab }): void => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const editor = froalaRef?.current?.editor;
            editor?.link?.insert(getNewURL(url), selectedText, {
              target: openInNewTab ? '__blank' : ''
            });
            editor?.selection?.restore();
            editor?.selection?.clear();
            setShowAddLink((c) => !c);
          }}
        />
      ) : null}
      <FroalaEditor
        ref={froalaRef}
        tag="textarea"
        onModelChange={handleModelChange}
        model={value}
        config={{
          toolbarButtons: BASIC_TOOLBAR,
          attribution: false,
          toolbarSticky: false,
          linkEditButtons: [],
          charCounterCount: true,
          charCounterMax: maxCharLimit || -1,
          placeholderText: placeholderText,
          key: LICENSE_KEY,
          enter: Froalaeditor.ENTER_BR,
          events: {
            initialized: function (): void {
              new Promise((resolve) => setTimeout(resolve, 1));
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (this as any).customUtils = {
                setShowAddLink,
                setSelectedText
              };
            }
          }
        }}
      />
    </div>
  );
};

BasicEditor.defaultProps = {
  placeholderText: undefined,
  maxCharLimit: undefined
};

export default BasicEditor;
