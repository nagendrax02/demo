import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IValue } from './associated-entity-label.type';
import styles from './entity-label.module.css';
import { classNames } from 'common/utils/helpers/helpers';

const Body = ({ body, config }: { body: IValue[]; config: IOption }): JSX.Element => {
  return (
    <>
      {body?.map((field) => {
        return (
          <div className={classNames(styles.body_field_wrapper, 'ng_p_2_m')} key={field?.key}>
            <div className={classNames(styles.field_label, styles.text_overflow)}>
              {field?.label}
            </div>
            <div
              className={classNames(styles.field_value, styles.text_overflow)}
              title={config?.[field?.key] as string}>
              {config?.[field?.key] ? config?.[field?.key] : '-'}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Body;
