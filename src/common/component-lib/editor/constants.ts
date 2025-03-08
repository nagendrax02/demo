const BASIC_TOOLBAR = ['bold', 'italic', 'underline', '|', 'formatOL', 'formatUL', 'customAddLink'];
const ADVANCED_TOOLBAR = [
  'fontFamily',
  '|',
  'fontSize',
  '|',
  'bold',
  'italic',
  'underline',
  '|',
  'textColor',
  'backgroundColor',
  '|',
  'formatOL',
  'formatUL',
  'indent',
  'outdent',
  '|',
  'alignLeft',
  'alignCenter',
  'alignRight',
  '|',
  'html',
  'customAddLink',
  'customInsertImage',
  'customInsertFile',
  'specialLinksDropdown',
  'insertTable',
  '|'
];

const ADD_LINK_TITLE = 'URL';
const WEB_PROTOCOLS = [
  {
    label: 'http://',
    value: 'http:/'
  },
  {
    label: 'https://',
    value: 'https://'
  },
  {
    label: 'ftp://',
    value: 'ftp://'
  },
  {
    label: 'news://',
    value: 'news://'
  },
  {
    label: '<other>',
    value: ''
  }
];
const LICENSE_KEY = 'UBB7jD5G4D3G4A3A7A6bHIMFI1EWBXIJe1BZLZFd1d1MXQLjC10D7D5A4B2A3D4E2C2C5==';

const FONT_FAMILY = {
  TIMES_NEW_ROMAN: 'Times New Roman',
  ARIAL: 'Arial',
  COURIER: 'Courier',
  CENTURY_GOTHIC: 'Century Gothic',
  ROBOTO: 'Roboto',
  POPPINS: 'Poppins',
  VERDANA: 'Verdana',
  UBUNTU: 'Ubuntu'
};

const TRIBUTEJS_OPTIONS = {
  values: [],
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  selectTemplate(item): string {
    if (item.original.value === '-1') return '';
    return `<span class="fr-deletable fr-tribute">@${item.original.value}</a></span>`;
  },
  containerClass: 'lsq-marvin-tribute-container',
  // autocompleteMode: true,
  requireLeadingSpace: true
};

export {
  BASIC_TOOLBAR,
  ADD_LINK_TITLE,
  WEB_PROTOCOLS,
  LICENSE_KEY,
  ADVANCED_TOOLBAR,
  FONT_FAMILY,
  TRIBUTEJS_OPTIONS
};
