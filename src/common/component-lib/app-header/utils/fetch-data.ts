import { AppHeaderSchema, IAppHeaderData } from '../app-header.types';
import { dummyData } from '../dummy';

/**
 * Fetches the app header data from API.
 *
 * This function simulates fetching the app header data from an API. It uses the
 * dummy data and validates the response using the zod schema. If the data format
 * is invalid, it throws an error.
 */

export const fetchAppHeaderData = async (): Promise<IAppHeaderData> => {
  const response = dummyData;

  // Validate the response using the zod schema
  const result = AppHeaderSchema.safeParse(response);

  if (!result.success) {
    throw new Error('Invalid data format');
  }
  return result.data;
};
