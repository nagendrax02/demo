import { EntityType } from 'common/types';

const setDocumentTitle = (title: string): void => {
  try {
    if (title) {
      document.title = title;
    } else {
      document.title = 'LeadSquared';
    }
  } catch (error) {
    console.log(error);
    document.title = 'LeadSquared';
  }
};

const updatePageTitle = ({
  entityType,
  name,
  representationName
}: {
  entityType: EntityType;
  name: string;
  representationName: string;
}): void => {
  switch (entityType) {
    case EntityType.Lead:
    case EntityType.Account:
      setDocumentTitle(`${name} - ${representationName} details`);
      break;
    case EntityType.Opportunity:
      setDocumentTitle(`${name} details`);
      break;
    default:
      document.title = 'LeadSquared';
  }
};

export { updatePageTitle, setDocumentTitle };
