import { CSSProperties } from 'react';

export interface IIcon {
  className?: string;
  type: 'outline' | 'filled' | 'duotone';
  style?: CSSProperties;
  dataTestId?: string;
}
