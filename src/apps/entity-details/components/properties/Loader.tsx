import { DataType, RenderType } from 'common/types/entity/lead';
import Name from './Name';
import Value from './Value';
import styles from './properties.module.css';
import { CallerSource } from 'src/common/utils/rest-client';

const Loader = (): JSX.Element => {
  const dummyData = {
    id: 'mx_Boolean_Checkbox',
    name: 'Boolean_Checkbox',
    schemaName: 'mx_Boolean_Checkbox',
    value: '0',
    fieldRenderType: 'Checkbox' as RenderType,
    dataType: 'Boolean' as DataType
  };
  return (
    <div className={styles.property_box}>
      {Array(10)
        .fill(0)
        .map((index: number) => {
          return (
            <div key={index} className={styles.shimmer_property}>
              <Name name="abc" isLoading />
              <Value
                property={dummyData}
                fields={undefined}
                entityConfig={undefined}
                isLoading
                callerSource={CallerSource.NA}
              />
            </div>
          );
        })}
    </div>
  );
};

export default Loader;
