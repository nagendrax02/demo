import { fetchData } from './account';
import { fetchDetails } from './details';
import {
  getAccountDropdownOptions,
  getAccountTypeDropdownOptions,
  getDropdownOptions
} from './dropdown-options';
import { fetchMetaData, fetchRepresentationName } from './metadata';

export default {
  fetchData,
  fetchDetails,
  fetchMetaData,
  fetchRepresentationName,
  getDropdownOptions,
  getAccountDropdownOptions,
  getAccountTypeDropdownOptions
};
