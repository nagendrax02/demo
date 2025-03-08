import { fetchDetails } from './details';
import getDropdownOptions, {
  getSalesGroupOptions,
  getStageDropdownOptions
} from './dropdown-options';
import { fetchData } from './lead';
import { fetchMetaData, fetchRepresentationName } from './metadata';

export default {
  fetchData,
  fetchDetails,
  fetchMetaData,
  fetchRepresentationName,
  getDropdownOptions,
  getSalesGroupOptions,
  getStageDropdownOptions
};
