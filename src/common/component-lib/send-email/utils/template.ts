import { CallerSource, Module, httpPost } from '../../../utils/rest-client';
import { API_URL } from '../constants';
import { ITemplateResponse } from '../send-email.types';

const fetchTemplateData = async ({
  lookupName,
  lookupValue,
  rowCount,
  includeCSV,
  searchText,
  callerSource
}: Record<string, string | number>): Promise<ITemplateResponse> => {
  const body = {
    Parameter: {
      Type: 2,
      LookupName: lookupName,
      LookupValue: lookupValue,
      Category: -1,
      SearchText: searchText
    },
    Sorting: {
      ColumnName: 'Name',
      Direction: 0
    },
    Paging: {
      Offset: 0,
      RowCount: rowCount
    },
    Columns: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Include_CSV: includeCSV
    }
  };

  const response = (await httpPost({
    path: API_URL.TEMPLATE_GET,
    module: Module.Marvin,
    body: body,
    callerSource: callerSource as CallerSource
  })) as ITemplateResponse;

  return response;
};

const removeStyleFromContent = (content: string): string => {
  try {
    const contentToRemove = content.match(/(\/\*\s*.*?)</);
    if (contentToRemove) return content.replace(contentToRemove[1], '');
  } catch (error) {
    console.log('SendEmail body removeStyleFromContent', error);
  }
  return content;
};

const getTemplateContent = (selectedTemplateData: ITemplateResponse): string | undefined => {
  if (selectedTemplateData?.List?.length) {
    const filteredContent = removeStyleFromContent(
      selectedTemplateData.List[0].Content_Html_Published
    );
    let templateContent = '';
    if (selectedTemplateData.List[0].Category && selectedTemplateData.List[0].Category === 1) {
      templateContent = selectedTemplateData.List[0].Content_Text_Published;
    } else if (
      selectedTemplateData.List[0].Category === 3 ||
      selectedTemplateData.List[0].Category === 2
    ) {
      if (filteredContent) templateContent = filteredContent;
      else templateContent = selectedTemplateData.List[0].Content_Html_Published;
    } else templateContent = selectedTemplateData.List[0].Content_Html_Published;

    return templateContent;
  }
};

export { fetchTemplateData, getTemplateContent };
