import { trackError } from 'common/utils/experience/utils/track-error';
const replacer = (matched: string): string => {
  try {
    const newStr = `<a  href="${matched}" target="_blank">${matched}</a>`;
    return newStr;
  } catch (error) {
    trackError(error);
    return '';
  }
};

const replaceURLInStringWithAnchorTag = (str: string | undefined): string | undefined => {
  try {
    // check if link already part of anchor tag,
    // if yes the no need to check for urls,
    // this already considered as html element
    const linkRegexBeginsWithHref =
      // eslint-disable-next-line no-useless-escape
      /(href=\")(https?\:\/\/)(www\.)?[^\s]+\.[^\s]+/g;
    const matchHref = str?.match(linkRegexBeginsWithHref);

    if (matchHref) {
      return str;
    }

    // if it is plain text and contains urls
    // find URLs and replace with anchor tag
    if (str && !matchHref) {
      // eslint-disable-next-line no-useless-escape
      const linkRegex = /(https?\:\/\/)(www\.)?[^\s]+\.[^\s]+/g;
      const modifiedStr = str.replaceAll(linkRegex, replacer);
      return modifiedStr;
    }
    return str;
  } catch (error) {
    trackError(error);
    return str;
  }
};

export { replaceURLInStringWithAnchorTag };
