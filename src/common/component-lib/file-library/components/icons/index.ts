import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Docs = withSuspense(lazy(() => import('./Docs')));
const Image = withSuspense(lazy(() => import('./Image')));
const Excel = withSuspense(lazy(() => import('./Excel')));
const PDF = withSuspense(lazy(() => import('./PDF')));
const PPT = withSuspense(lazy(() => import('./PPT')));
const Word = withSuspense(lazy(() => import('./Word')));
const Zip = withSuspense(lazy(() => import('./Zip')));
const Generic = withSuspense(lazy(() => import('./Generic')));
const Info = withSuspense(lazy(() => import('./Info')));
const DocDualTone = withSuspense(lazy(() => import('./DocDualTone')));
const ImageDualTone = withSuspense(lazy(() => import('./ImageDualTone')));
const Audio = withSuspense(lazy(() => import('./Audio')));
const Video = withSuspense(lazy(() => import('./Video')));

export {
  Docs,
  Image,
  Excel,
  PDF,
  PPT,
  Word,
  Zip,
  Info,
  DocDualTone,
  ImageDualTone,
  Audio,
  Video,
  Generic
};
