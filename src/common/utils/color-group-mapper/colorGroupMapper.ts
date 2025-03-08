import { CSSProperties } from 'react';
/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line max-lines-per-function
export const colorGroupMapper = (hexColorCode: string): string => {
  const COLOR_GROUP__MAP: Record<string, string> = {
    F8BBD0: '--ng-lotuspink',
    CC7795: '--ng-lotuspink',
    F06293: '--ng-lotuspink',
    F06292: '--ng-lotuspink',
    FF6292: '--ng-lotuspink',
    '880E4F': '--ng-lotuspink',

    F50157: '--ng-magenta',
    '870E4F': '--ng-magenta',
    C2175B: '--ng-magenta',
    C2185B: '--ng-magenta',
    F50057: '--ng-magenta',

    EFBAE7: '--ng-violet',
    CE93D8: '--ng-violet',
    AB47BC: '--ng-violet',
    '8E24AA': '--ng-violet',
    D501F9: '--ng-violet',
    D500F9: '--ng-violet',
    B9A4BD: '--ng-violet',

    C3CAE9: '--ng-ink-blue',
    '9AA8DA': '--ng-ink-blue',
    '213394': '--ng-ink-blue',
    '556BC1': '--ng-ink-blue',
    '194DFF': '--ng-ink-blue',
    '9BA8DA': '--ng-ink-blue',
    '546BC1': '--ng-ink-blue',
    '213494': '--ng-ink-blue',

    '3AD0C5': '--ng-cyan',
    '98E2DB': '--ng-cyan',
    '05AC9B': '--ng-cyan',
    '027D6B': '--ng-cyan',
    '02F1B7': '--ng-cyan',
    '97E2DB': '--ng-cyan',
    '39D0C5': '--ng-cyan',
    '007D94': '--ng-cyan',
    '00F1B7': '--ng-cyan',
    '0E7': '--ng-cyan',

    B8E8C9: '--ng-success',
    '85DAA7': '--ng-success',
    '00C06A': '--ng-success',
    '00933D': '--ng-success',
    '07EE77': '--ng-success',
    B3C18B: '--ng-success',
    '86DAA7': '--ng-success',
    '00AC9B': '--ng-success',

    E5EE9C: '--ng-green',
    D3E157: '--ng-green',
    AFB42C: '--ng-green',
    '827718': '--ng-green',
    AFEA00: '--ng-green',
    C1AB6B: '--ng-green',
    E6EE9C: '--ng-green',
    D4E157: '--ng-green',
    AFB42B: '--ng-green',
    827717: '--ng-green',
    AEEA00: '--ng-green',

    FFECB3: '--ng-warning',
    FFCA27: '--ng-warning',
    CB4E0A: '--ng-warning',
    FFA000: '--ng-warning',
    FE6F00: '--ng-warning',
    FFCA28: '--ng-warning',
    CB4E09: '--ng-warning',
    FF6F00: '--ng-warning',

    DCCBC8: '--ng-brown',
    BCAAA4: '--ng-brown',
    '8D6E63': '--ng-brown',
    '743e9': '--ng-brown',
    '743E0A': '--ng-brown',

    C3E3F1: '--ng-sky-blue',

    '90A4AE': '--ng-grey',
    '455A64': '--ng-grey',
    '607D8B': '--ng-grey',
    '7888AC': '--ng-grey',

    '79af94': '--ng-teal',
    '8CB7B1': '--ng-teal',
    '79AF94': '--ng-teal',
    '7AAF94': '--ng-teal'
  };

  return COLOR_GROUP__MAP[hexColorCode?.toUpperCase()];
};

export const getTaskColorGroup = (hexColor: string): CSSProperties => {
  const colorGroup = hexColor ? colorGroupMapper(hexColor.replace('#', '')) ?? '' : '';

  if (!colorGroup) {
    return {
      backgroundColor: 'rgba(var(--ng-neutral-20))',
      fill: 'rgba(var(--ng-neutral-60))'
    };
  }

  return {
    backgroundColor: `rgba(var(${colorGroup + '-0'}))`,
    fill: `rgba(var(${colorGroup + '-40'}))`
  };
};
