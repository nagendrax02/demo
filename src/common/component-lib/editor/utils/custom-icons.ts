/* eslint-disable max-lines-per-function */
import Froalaeditor from 'froala-editor';
import { LibraryType } from '../../file-library/file-library.types';
const icons = {
  // Basic
  bold: '<path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"></path>',
  italic: '<path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"></path>',
  underline:
    '<path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"></path>',
  formatOL:
    '<path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"></path>',
  formatUL:
    '<path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"></path>',
  insertLink:
    '<path d="M8 11h8v2H8zm12.1 1H22c0-2.76-2.24-5-5-5h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1zM3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM19 12h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path>',
  customAddLink:
    '<path d="M8 11h8v2H8zm12.1 1H22c0-2.76-2.24-5-5-5h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1zM3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM19 12h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path>',

  // Advanced
  textColor:
    '<path d="M2 20h20v4H2v-4zm3.49-3h2.42l1.27-3.58h5.65L16.09 17h2.42L13.25 3h-2.5L5.49 17zm4.42-5.61 2.03-5.79h.12l2.03 5.79H9.91z"></path>',
  backgroundColor:
    '<path d="M16.56 8.94 7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10 10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5zM2 20h20v4H2v-4z"></path>',
  insertImage:
    '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>',
  specialLinksDropdown:
    '<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>',
  insertFile:
    '<path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path>'
};

export function appendColorDotIn(parent: HTMLElement): void {
  const colorCircle = document.createElement('div');
  colorCircle.classList.add('lsq-fr-color-circle');

  parent.appendChild(colorCircle);
}

export function initializeTools(): void {
  const spaceInHTML = `<span>&nbsp;</span>`;

  function getMailingPreferenceHTML(): string {
    return `<a href="MXVAR[{managesubscriptionurl}]" target="_blank" rel="noreferrer" style="text-decoration: none;">Mailing Preferences</a>${spaceInHTML}`;
  }

  function getUnsubscribeLinkHTML(): string {
    return `<a href="MXVAR[{unsubscribeurl}]" target="_blank" rel="noreferrer" style="text-decoration: none;">Unsubscribe</a>${spaceInHTML}`;
  }

  function getViewOnBrowserLinkHTML(): string {
    return `<a href="MXVAR[{viewinbrowserurl}]" target="_blank" rel="noreferrer" style="text-decoration: none;">View On Browser</a>${spaceInHTML}`;
  }

  Froalaeditor.RegisterCommand('specialLinksDropdown', {
    title: 'Add Special Links',
    type: 'dropdown',
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    options: {
      mailingPreferences: 'Mailing Preferences',
      unsubscribe: 'unsubscribe',
      viewOnBrowser: 'View On Browser'
    },
    callback: function onClickSpecialLinkItem(cmd, val) {
      // eslint-disable-next-line default-case
      switch (val) {
        case 'mailingPreferences':
          this.html.insert(getMailingPreferenceHTML());
          break;

        case 'unsubscribe':
          this.html.insert(getUnsubscribeLinkHTML());
          break;

        case 'viewOnBrowser':
          this.html.insert(getViewOnBrowserLinkHTML());
          break;
      }
      this.spaces.normalizeAroundCursor();
    }
  });

  Froalaeditor.RegisterCommand('customAddLink', {
    title: 'Add Link',
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    callback: function () {
      const selectedText = this.selection.text();
      this.selection.save();
      this?.customUtils?.setShowAddLink((c) => !c);
      this?.customUtils?.setSelectedText(selectedText);
    }
  });

  Froalaeditor.RegisterCommand('customInsertImage', {
    title: 'Insert Image',
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    callback: function onClickCustomImageBtn() {
      this?.customUtils.showLibraryOf(LibraryType.Images);
    }
  });

  Froalaeditor.RegisterCommand('customInsertFile', {
    title: 'Insert File Link',
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    callback: function onClickCustomImageBtn() {
      this?.customUtils.showLibraryOf(LibraryType.Documents);
    }
  });

  Froalaeditor.DefineIconTemplate(
    'custom_svg',
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">[PATH]</svg>'
  );

  // Basic

  Froalaeditor.DefineIcon('bold', { PATH: icons.bold, template: 'custom_svg' });
  Froalaeditor.DefineIcon('italic', {
    PATH: icons.italic,
    template: 'custom_svg'
  });
  Froalaeditor.DefineIcon('underline', {
    PATH: icons.underline,
    template: 'custom_svg'
  });
  Froalaeditor.DefineIcon('formatOL', {
    PATH: icons.formatOL,
    template: 'custom_svg'
  });
  Froalaeditor.DefineIcon('formatUL', {
    PATH: icons.formatUL,
    template: 'custom_svg'
  });
  Froalaeditor.DefineIcon('customAddLink', {
    PATH: icons.customAddLink,
    template: 'custom_svg'
  });

  // Advanced

  Froalaeditor.DefineIcon('textColor', {
    PATH: icons.textColor,
    template: 'custom_svg'
  });
  Froalaeditor.DefineIcon('backgroundColor', {
    PATH: icons.backgroundColor,
    template: 'custom_svg'
  });
  Froalaeditor.DefineIcon('customInsertImage', {
    PATH: icons.insertImage,
    template: 'custom_svg'
  });
  Froalaeditor.DefineIcon('customInsertFile', {
    PATH: icons.insertFile,
    template: 'custom_svg'
  });
  Froalaeditor.DefineIcon('specialLinksDropdown', {
    PATH: icons.specialLinksDropdown,
    template: 'custom_svg'
  });
}

export default icons;
