import { useContext } from 'react';
import { IUseLocale } from './locale.types';
import { LocaleContext } from './LocaleProvider';

const useLocale = (): IUseLocale => {
  const { translate } = useContext(LocaleContext);

  return { translate };
};

export default useLocale;
