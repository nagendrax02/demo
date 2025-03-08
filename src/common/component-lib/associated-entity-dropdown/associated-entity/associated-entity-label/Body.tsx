import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IValue } from './associated-entity-label.type';
import styles from './entity-label.module.css';

const Body = ({ body, config }: { body: IValue[]; config: IOption }): JSX.Element => {
  return (
    <div className={styles?.body_wrapper}>
      {body?.map((field) => {
        return (
          <div className={styles?.body_field_wrapper} key={field?.key}>
            <div className={styles?.field_label}>{field?.label}</div>
            <div className={styles?.field_value} title={config?.[field?.key] as string}>
              {config?.[field?.key] ? config?.[field?.key] : '-'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Body;
