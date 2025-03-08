/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { FONT_FAMILY } from '../constants';

export const froalaConfig = {
  fontFamily: {
    "'Times New Roman', sans-serif": FONT_FAMILY.TIMES_NEW_ROMAN,
    "'Arial', sans-serif": FONT_FAMILY.ARIAL,
    "'Courier Prime', monospace": FONT_FAMILY.COURIER,
    "'Century Gothic', sans-serif": FONT_FAMILY.CENTURY_GOTHIC,
    "'Roboto', sans-serif": FONT_FAMILY.ROBOTO,
    "'Poppins', sans-serif": FONT_FAMILY.POPPINS,
    "'Ubuntu', sans-serif": FONT_FAMILY.UBUNTU,
    "'Verdana', sans-serif": FONT_FAMILY.VERDANA
  },
  fontSizes: [
    '10',
    '12',
    '14',
    '16',
    '18',
    '20',
    '22',
    '24',
    '26',
    '28',
    '32',
    '36',
    '40',
    '44',
    '48',
    '52',
    '56',
    '60',
    '64'
  ],
  getBackgrounds: (colorArrayFor: string): string[] => {
    return [
      colorArrayFor === 'background'
        ? 'rgb(var(--marvin-base))'
        : 'rgb(var(--marvin-secondary-text))',
      '#ff00aa',
      '#F5A623',
      '#F8E71C',
      '#8B572A',
      '#7ED321',
      '#417505',
      '#BD10E0',
      '#9013FE',
      '#4A90E2',
      '#50E3C2',
      '#B8E986',
      '#000000',
      '#4A4A4A',
      '#9B9B9B',
      '#FFFFFF'
    ];
  }
};
