export const handleKeyboardEvents = (handleSearch: (close?: boolean) => void): (() => void) => {
  const handleOnKeyPress = (event: { keyCode: number }): void => {
    const { keyCode } = event;
    if (keyCode === 13) {
      handleSearch();
    }
  };
  document.addEventListener('keydown', handleOnKeyPress);
  return () => {
    document.removeEventListener('keydown', handleOnKeyPress);
  };
};
