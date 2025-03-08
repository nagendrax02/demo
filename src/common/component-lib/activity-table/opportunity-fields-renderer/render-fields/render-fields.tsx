import { IField } from '../opportunity-fields-renderer.types';
import Field from './Field';

const renderFields = (fields: IField[]): JSX.Element => {
  const renderValues = (field: IField): JSX.Element[] | undefined => {
    return field.Fields?.length
      ? field.Fields.map((childField) => {
          const { DisplayName: childFieldDisplayName, Value: childFieldValue } = childField;
          return (
            <Field
              key={childFieldValue}
              displayName={childFieldDisplayName}
              value={childFieldValue}
            />
          );
        })
      : undefined;
  };

  return (
    <>
      {fields?.length ? (
        fields.map((field) => {
          const { Value: fieldValue, DisplayName: fieldDisplayName } = field;
          return (
            <Field
              key={fieldValue}
              displayName={fieldDisplayName}
              value={fieldValue}
              renderValues={renderValues(field)}
            />
          );
        })
      ) : (
        <span>-</span>
      )}
    </>
  );
};

export default renderFields;
