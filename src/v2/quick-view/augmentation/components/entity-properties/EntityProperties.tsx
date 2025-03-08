import { ReactNode } from 'react';
import { IEntityProperty } from 'common/types/entity/lead/metadata.types';
import styles from './entity-properties.module.css';
import { classNames } from 'common/utils/helpers/helpers';
import FieldRenderer from 'v2/component-lib/field-renderer';
import { CallerSource } from 'common/utils/rest-client';

const EntityProperties = ({
  title,
  properties,
  fields = {}
}: {
  title?: string;
  properties: IEntityProperty[];
  fields?: Record<string, string | null>;
}): ReactNode => {
  return (
    <div className={styles.container}>
      {title ? <div className={classNames('ng_sh_sb', styles.title)}>{title}</div> : null}
      {properties.map((config) => {
        return (
          <div className={styles.field_data_container} key={config?.id}>
            <div className={classNames('ng_p_2_m', styles.field_display_name)}>
              <div className={styles.field_renderer_label_container}>{config?.name}</div>
            </div>
            <div className={classNames('ng_p_1_m', styles.field_value)}>
              {config.value ? (
                <FieldRenderer
                  property={config}
                  fields={fields}
                  callerSource={CallerSource.SmartViews}
                />
              ) : (
                <>--</>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EntityProperties;
