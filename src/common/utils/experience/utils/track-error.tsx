type ITrackError = (...args) => void;
export const trackError: ITrackError = (...args): void => {
  args.forEach((arg) => {
    if (arg instanceof Error) {
      //Adding source property to track the errors in NewRelic
      (arg as Error & { source?: string }).source = 'next-gen-app';
      return true;
    }
  });

  //Console error will be supported in this file only
  // eslint-disable-next-line no-restricted-syntax
  console.error(...args);
};
