import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';

export enum BgColor {
  Blue500 = 'bg_blue_500',
  Sky500 = 'bg_sky_500',
  Green500 = 'bg_green_500',
  Cyan500 = 'bg_cyan_500',
  Purple500 = 'bg_purple_500',
  Orange500 = 'bg_orange_500',
  Indigo500 = 'bg_indigo_500',
  Blue700 = 'bg_blue_700',
  Red700 = 'bg_red_700',
  Danger1 = 'bg_danger_1'
}

export interface IStyledIcon {
  name?: string;
  children?: JSX.Element;
  bgColor?: BgColor;
  variant?: IconVariant;
  dataTestId?: string;
}
