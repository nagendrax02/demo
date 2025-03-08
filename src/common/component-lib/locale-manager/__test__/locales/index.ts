const translation = {
  en: (): Promise<unknown> => import('./en.json'),
  br: (): Promise<unknown> => import('./br.json'),
  hi: (): Promise<unknown> => import('./hi.json'),
  ab: (): Promise<unknown> => import('./hi.json'),
  vi: (): Promise<unknown> => import('./hi.json'),
  id: (): Promise<unknown> => import('./hi.json'),
  la: (): Promise<unknown> => import('./hi.json')
};
export default translation;
