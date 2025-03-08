import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { IFileInfo, IDocumentsToFetch } from './files.type';

interface IFetchCFSFiles {
  leadId: string | null;
  entityId?: string | null;
  documentsToFetch: IDocumentsToFetch[];
  getAllCFSDataOfActivity?: boolean;
}

const fetchCFSFiles = async (
  data: IFetchCFSFiles,
  callerSource: CallerSource
): Promise<IFileInfo | null> => {
  try {
    const { leadId, entityId, documentsToFetch, getAllCFSDataOfActivity } = data;

    const body = {
      LeadId: leadId,
      EntityId: entityId,
      DocumentsToFetch: documentsToFetch,
      // GetAllCFSDataOfActivity keeps the zip folder name and structure similar to platform (refer ticket: https://leadsquared.atlassian.net/browse/SWLIT-755)
      GetAllCFSDataOfActivity: getAllCFSDataOfActivity
    };

    const response: IFileInfo = await httpPost({
      path: API_ROUTES.getFileUrl,
      module: Module.Marvin,
      body,
      callerSource
    });

    return response;
  } catch (error) {
    trackError(error);
    return null;
  }
};

export { fetchCFSFiles };
