import { trackError } from 'common/utils/experience/utils/track-error';
const createEl = (fontSize: number, fontFamily: string, text: string): HTMLSpanElement => {
  const tempEle = document.createElement('span');
  tempEle.style.font = fontSize + 'px ' + fontFamily;
  tempEle.textContent = text;
  tempEle.style.visibility = 'hidden';
  return tempEle;
};

const getDefaultFontFamily = (): string => {
  try {
    const tempElement = document.createElement('span');
    tempElement.textContent = 'A';
    tempElement.style.visibility = 'hidden';
    document.body.appendChild(tempElement);
    const fontFamily = window?.getComputedStyle(tempElement)?.fontFamily;
    document.body.removeChild(tempElement);
    return fontFamily;
  } catch (error) {
    trackError(error);
    return `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;
  }
};

const getTextWidth = (text: string, fontSize: number, fontFamily: string): number => {
  try {
    const spanEl = createEl(fontSize, fontFamily, text);
    document.body.appendChild(spanEl);
    const width = spanEl.offsetWidth;
    document.body.removeChild(spanEl);
    return width;
  } catch (error) {
    trackError(error);
    return 84;
  }
};

const getTabNameWidth = (): ((text: string, fontSize: number) => number) => {
  const fontFamily = getDefaultFontFamily();
  return (text: string, fontSize: number): number => {
    const paddingLeftAndRight = 32;
    const extraWidth = 4;
    return getTextWidth(text, fontSize, fontFamily) + paddingLeftAndRight + extraWidth;
  };
};

export { getTabNameWidth };
