import { trackError } from 'common/utils/experience/utils/track-error';
import { MX_EXCEPTION, ERROR_MSG } from '../constant';
import { IHttpError, IErroneousResponse } from '../rest-client.types';

const createHttpError = (response: Response, errorJsonResponse: IErroneousResponse): IHttpError => {
  const message = errorJsonResponse?.ExceptionMessage || errorJsonResponse?.Message;
  const type = errorJsonResponse?.ExceptionType || errorJsonResponse?.Type;
  const error: IHttpError = new Error(message || String(response.status));

  error.name = type || MX_EXCEPTION;
  error.status = response.status;
  error.response = errorJsonResponse;
  error.type = type;

  return error;
};

const getHttpError = async (response: Response): Promise<IHttpError> => {
  try {
    const errorResponse = (await response.json()) as IErroneousResponse;
    return createHttpError(response, errorResponse);
  } catch (error) {
    trackError(error);
  }
  const error: IHttpError = new Error(ERROR_MSG.generic);
  error.status = response.status;
  return error;
};

export { getHttpError };
