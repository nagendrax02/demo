import { LibraryType } from '../../file-library/file-library.types';
import { ILibraryCategories } from '../common.types';

const getLibraryCategories = (currentDocumentType: LibraryType): ILibraryCategories[] => {
  const libraryCategories = [
    {
      type: LibraryType.Documents,
      show: currentDocumentType === LibraryType.Documents
    },
    {
      type: LibraryType.Images,
      show: currentDocumentType === LibraryType.Images
    }
  ];

  return libraryCategories;
};

export { getLibraryCategories };
