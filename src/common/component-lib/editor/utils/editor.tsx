import { trackError } from 'common/utils/experience/utils/track-error';
import FileLibrary from '../../file-library';
import { IFile, LibraryType } from '../../file-library/file-library.types';
import { getLibraryCategories } from './file-library';
import { froalaConfig } from '../utils/fonts';
import { ADVANCED_TOOLBAR, FONT_FAMILY, LICENSE_KEY } from '../constants';
import { CallerSource } from 'common/utils/rest-client';

const AddImage = (editor, currentDocumentType: LibraryType, files: IFile[]): void => {
  const file = files?.[0];
  editor.html.insert(
    currentDocumentType === LibraryType.Images
      ? `<img src="${file.Path}" />`
      : `<a class="editor-selected-file-link" href="${file.Path}">${file.Path}</a>`
  );
};

const getFileLibrary = ({
  showLibrary,
  setShowLibrary,
  editor,
  currentDocumentType,
  callerSource
}: {
  showLibrary: boolean;
  setShowLibrary: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  editor: any;
  currentDocumentType: LibraryType;
  callerSource: CallerSource;
}): JSX.Element => {
  if (showLibrary) {
    return (
      <FileLibrary
        setShow={setShowLibrary}
        onFilesSelect={(newFiles: IFile[]) => {
          AddImage(editor, currentDocumentType, newFiles);
        }}
        libraryCategories={getLibraryCategories(currentDocumentType)}
        showFooter={false}
        isSingleSelect
        callerSource={callerSource}
      />
    );
  }
  return <></>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getEditorOptions = (placeholderText?: string, maxCharLimit?: number): Record<string, any> => {
  return {
    attribution: false,
    charCounterCount: true,
    charCounterMax: maxCharLimit || -1,
    codeMirror: false,
    fontFamily: froalaConfig.fontFamily,
    fontFamilySelection: true,
    fontFamilyDefaultSelection: FONT_FAMILY.ARIAL,
    fontSize: froalaConfig.fontSizes,
    fontSizeDefaultSelection: '16',
    fontSizeSelection: true,
    key: LICENSE_KEY,
    linkEditButtons: [],
    placeholderText: placeholderText,
    toolbarButtons: ADVANCED_TOOLBAR,
    toolbarButtonsSM: [],
    toolbarButtonsXS: [],
    toolbarSticky: false,
    colorsBackground: froalaConfig.getBackgrounds('background'),
    colorsText: froalaConfig.getBackgrounds('color'),
    tableColorsStep: 4,
    colorsStep: 4,
    colorsHEXInput: false,
    imageUploadRemoteUrls: false
  };
};

const SECOND_TOOLBAR_CLASS = '.fr-second-toolbar';
const errorMessage = {
  text: 'Maximum character limit reached',
  className: 'count-error-message'
};

function getErrorMessageHTML(): HTMLSpanElement {
  const span: HTMLSpanElement = document.createElement('span');
  span.textContent = errorMessage.text;
  span.classList.add(errorMessage.className);
  span.style.color = 'rgb(var(--marvin-danger-1))';
  return span;
}

export function showErrorMessageIfCountExceeded(showError: boolean): void {
  try {
    const secondToolbarEl = document.querySelector(SECOND_TOOLBAR_CLASS);
    if (secondToolbarEl) {
      const errorMsgEl = secondToolbarEl.querySelector(`.${errorMessage.className}`);

      if (showError && !errorMsgEl) {
        const errorMsgElement = getErrorMessageHTML();
        secondToolbarEl.prepend(errorMsgElement);
      } else if (!showError && errorMsgEl) {
        secondToolbarEl.removeChild(errorMsgEl);
      }
    }
  } catch (error) {
    trackError(error);
  }
}

export { getFileLibrary, getEditorOptions };
