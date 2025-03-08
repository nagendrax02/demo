import {
  IAugmentedAttributeFields,
  IEntityDetailsCoreData
} from 'apps/entity-details/types/entity-data.types';
import Field from './Field';
import styles from './content.module.css';
export interface IContent {
  fields: IAugmentedAttributeFields[];
  coreData?: IEntityDetailsCoreData;
}

const Content = ({ fields, coreData }: IContent): JSX.Element => {
  return (
    <div className={styles.content}>
      <div className={styles.container}>
        {fields?.map((field) => {
          return <Field key={field?.id} field={field} coreData={coreData} />;
        })}
      </div>
    </div>
  );
};

export default Content;
