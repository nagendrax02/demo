export const getTranslatedText = (
  translatedValue: string,
  replacementKeys?: Record<string, string>
): string => {
  try {
    if (replacementKeys && typeof replacementKeys === 'object') {
      translatedValue = translatedValue?.replace(
        /{{(.*?)}}/g,
        (match, replacerKey) => replacementKeys[replacerKey] || match
      );
    }
    return translatedValue?.replace(/{{|}}/g, '');
  } catch (error) {
    console.log('Error in LocaleProvider: Translate', error);
  }
  return translatedValue;
};
