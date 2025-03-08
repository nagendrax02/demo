import FroalaEditor from 'react-froala-wysiwyg';
import Tribute from 'tributejs';

import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
require('./advanced-editor.css');
require('../styles/font-family.css');

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min';
import 'froala-editor/js/plugins.pkgd.min';

// for icons
import { initializeTools } from '../utils/custom-icons';

import { TRIBUTEJS_OPTIONS } from '../constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import { appendColorDotIn } from '../utils/custom-icons';
import { IMailMergeOption } from '../../send-email/send-email.types';
import { handleTribute, initializeTribute } from '../utils/tribute-utis';
import { getNewURL } from '../utils/common';
import { AddLink } from '../tools';
import { LibraryType } from '../../file-library/file-library.types';
import { getEditorOptions, getFileLibrary } from '../utils/editor';
import { CallerSource } from 'common/utils/rest-client';

export interface IAdvancedEditor {
  value: string;
  onValueChange: (htmlString: string) => void;
  callerSource: CallerSource;
  placeholderText?: string;
  maxCharLimit?: number;
  customStyleClass?: string;
  mailMergeOptions?: IMailMergeOption[];
  mailMergeMenuTitle?: string;
}

const tribute = new Tribute(TRIBUTEJS_OPTIONS);

const AdvancedEditor = (props: IAdvancedEditor): JSX.Element => {
  const {
    value,
    onValueChange,
    placeholderText,
    maxCharLimit,
    customStyleClass,
    mailMergeOptions,
    mailMergeMenuTitle,
    callerSource
  } = props;
  initializeTools();
  const [tributeHeadingPos, setTributeHeadingPos] = useState<number[]>([]);
  const [isFroalaInitialized, setIsFroalaInitialized] = useState<boolean>(false);
  const [showAddLink, setShowAddLink] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [currentDocumentType, setCurrentDocumentType] = useState<LibraryType>(LibraryType.Images);
  const [showLibrary, setShowLibrary] = useState<boolean>(false);

  function showLibraryOf(type: LibraryType): void {
    setCurrentDocumentType(type);
    setShowLibrary(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const froalaRef = useRef<any>({ editor: null });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const [editor, setEditor] = useState<any>(undefined);

  const handleModelChange = useCallback(
    (event) => {
      onValueChange(event);
    },
    [onValueChange]
  );

  useEffect(() => {
    if (froalaRef.current.editor && isFroalaInitialized) {
      setEditor(froalaRef.current.editor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [froalaRef.current, isFroalaInitialized]);

  useEffect(() => {
    if (isFroalaInitialized && editor) {
      tribute.attach(editor.el);
      editor.events?.on(
        'keydown',
        (e) => {
          handleTribute({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            event: e,
            tribute: tribute,
            tributePosition: tributeHeadingPos,
            menuTitle: mailMergeMenuTitle || 'Lead'
          });
        },
        true
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFroalaInitialized, editor]);

  useEffect(() => {
    initializeTribute(mailMergeOptions || [], tribute, setTributeHeadingPos);
  }, [mailMergeOptions]);

  return (
    <div
      className={`advanced-container ${customStyleClass}`}
      data-testid="marvin-froala-advanced-editor">
      {showLibrary
        ? getFileLibrary({
            showLibrary: showLibrary,
            setShowLibrary: setShowLibrary,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            editor: editor,
            currentDocumentType: currentDocumentType,
            callerSource: callerSource
          })
        : null}
      {showAddLink ? (
        <AddLink
          setShow={setShowAddLink}
          onSubmit={({ url, openInNewTab }): void => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
          ...getEditorOptions(placeholderText, maxCharLimit),
          events: {
            initialized: function onEditorInitialized(): void {
              const textColorButton = document.querySelector(
                '[data-cmd="textColor"]'
              ) as HTMLElement;
              const bgColorButton = document.querySelector(
                '[data-cmd="backgroundColor"]'
              ) as HTMLElement;

              if (textColorButton) appendColorDotIn(textColorButton);
              if (textColorButton) appendColorDotIn(bgColorButton);

              new Promise((resolve) => setTimeout(resolve, 1));
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (this as any).customUtils = {
                setShowAddLink,
                setSelectedText,
                showLibraryOf
              };

              setIsFroalaInitialized(true);
            },

            // eslint-disable-next-line @typescript-eslint/naming-convention
            'commands.after': function onCommandAfter(cmd, param1): void {
              if (cmd === 'applytextColor' || cmd === 'applybackgroundColor') {
                const commandSelector = {
                  applytextColor: '[data-cmd="textColor"] > .lsq-fr-color-circle',
                  applybackgroundColor: '[data-cmd="backgroundColor"] > .lsq-fr-color-circle'
                };
                const dotEl = document.querySelector(`${commandSelector[cmd]}`);
                if (dotEl) {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  (dotEl as HTMLElement).style.backgroundColor = param1;
                }
              }
            }
          }
        }}
      />
    </div>
  );
};

AdvancedEditor.defaultProps = {
  placeholderText: undefined,
  maxCharLimit: undefined,
  customStyleClass: '',
  mailMergeOptions: undefined,
  mailMergeMenuTitle: undefined
};

export default AdvancedEditor;
