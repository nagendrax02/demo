import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';
import styles from './content.module.css';
import Field from '../Field';

interface IContent {
  fields: IAugmentedAttributeFields[] | null;
}

const Content = ({ fields }: IContent): JSX.Element => {
  return (
    <div className={`${styles.content} content`} data-testid="ead-content">
      {fields?.map((field) => {
        return <Field key={field?.id} data={field} />;
      })}
    </div>
  );
};

export default Content;
