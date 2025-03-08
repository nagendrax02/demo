import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable no-useless-escape */
export const getValidatedMailMergeFields = (content: string): string => {
  try {
    const mailMergeRegex = /@\{([^{}]+)\}/g;
    const validatedContent = content?.replace(mailMergeRegex, (i, match) => {
      let augmentedMatch: string = `${match}` || '';
      if (!augmentedMatch?.includes(',')) {
        augmentedMatch += ',';
      }
      const decodedMatch = decodeURIComponent(augmentedMatch);
      if (decodeURI(augmentedMatch) !== decodedMatch) {
        return `@{${decodedMatch}}`;
      }
      return `@{${augmentedMatch}}`;
    });
    return validatedContent;
  } catch (error) {
    trackError('Error while getting validated mail merge fields', error);
    return content;
  }
};

const getDecodedSpaceCharacters = (content: string): string => {
  try {
    if (content && content?.length) {
      const encodedSpaceRegex = /%20/g;
      const decodedSpaceContent = content?.replace(encodedSpaceRegex, ' ');
      return decodedSpaceContent;
    }
    return content;
  } catch (error) {
    trackError('Error while decoding space characters', error);
    return content;
  }
};

export const getFormattedContentHTML = (contentHTML: string): string => {
  try {
    let formattedContentHTML: string = '';
    formattedContentHTML = getValidatedMailMergeFields(contentHTML);
    formattedContentHTML = getDecodedSpaceCharacters(formattedContentHTML);
    return formattedContentHTML || '';
  } catch (error) {
    trackError('Error while getting formatted contentHTML');
    return contentHTML || '';
  }
};

export const getContextText = (contentHtml: string): string => {
  let text = contentHtml;
  text = text.replace(/<br>/gi, '\n');
  text = text.replace(/<br \/>/gi, '\n');
  text = text.replace(/<p/gi, '{mx1br}<p');
  text = text.replace(/<h([0-9]) /gi, '{mx2br}**<h$1 ');
  text = text.replace(/<\/h([0-9])*?>/gi, '</h$1>**\n');
  text = text.replace(/<tr/gi, '\n<tr');
  text = text.replace(/&nbsp;/gi, ' ');
  text = text.replace(/<o:[^>]*>[^]*?<[\/]o:>/gi, '');
  text = text.replace(/<head[^>]*>[^]*?<[\/]head>/gi, '');
  text = text.replace(/<title[^>]*>[^]*?<[\/]title>/gi, '');
  text = text.replace(/<style[^>]*>[^]*?<[\/]style>/gi, '');
  text = text.replace(/<script[^>]*>[^]*?<[\/]script>/gi, '');
  text = text.replace(/<li (.*?)>/gi, '* ');
  text = text.replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/gi, '$2&lt;$1 &gt;');
  text = text.replace(/<(?:.|\s)*?>/g, '');
  text = text.replace(/[\r\n]/gi, '{mxnewline}');
  text = text.replace(/[\t\s]{1,}\{mxnewline\}/gi, '');
  text = text.replace(/([\t\s]*)(.*?)\{mxnewline\}/gi, '$2\n');
  text = text.replace(/(\t){3,}/gi, ' | ');
  text = text.replace(/(\n){3,}/gi, '\n');
  text = text.replace(/\{mx2br\}/gi, '\n\n');
  text = text.replace(/\{mx1br\}/gi, '\n');
  text = text.replace(/\*\*(\s*?)\*\*/gi, '**\n**');
  text = text.replace(/(\n){4,}/gi, '\n');
  text = text.replace(/^\n+|\n+$/gi, '');
  text = text.replace(/^\s+|\s+$/gi, '');
  text = text.replace(/^\t+|\t+$/gi, '');
  return text;
};
