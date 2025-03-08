const handleLineBreaksForNonHTML = (input: string | undefined): string => {
  try {
    return input ? input?.replace(/\n+\s*\n*/g, '<br />') : '';
  } catch (error) {
    return input || '';
  }
};

export { handleLineBreaksForNonHTML };
