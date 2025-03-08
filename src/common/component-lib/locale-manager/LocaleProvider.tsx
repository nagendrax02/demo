import { ILocaleContext, ILocaleProvider } from './locale.types';
import React from 'react';
import useTranslation from './use-translation';

const LocaleContext = React.createContext<ILocaleContext>({} as ILocaleContext);

const LocaleProvider = (props: ILocaleProvider): JSX.Element => {
  const { children, translationFile } = props;
  const { translate } = useTranslation({ translationFile });

  return (
    <LocaleContext.Provider
      value={{
        translate
      }}>
      {children}
    </LocaleContext.Provider>
  );
};

export { LocaleProvider, LocaleContext };
