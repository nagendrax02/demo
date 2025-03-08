import Icon from '../icon';
import styles from '../vcard.module.css';
import Primary from './Primary';
import Secondary from './Secondary';
import { IBodyConfig } from '../../../types/vcard.types';
import { Tertiary } from '.';
import { IEntityDetailsCoreData } from '../../../types/entity-data.types';

interface IBody {
  isLoading: boolean;
  config: IBodyConfig | undefined;
  coreData: IEntityDetailsCoreData;
  fieldValues?: Record<string, string | null>;
}

const Body = ({ isLoading, config, coreData, fieldValues }: IBody): JSX.Element => {
  return (
    <div className={styles.body} data-testid="vcard-body">
      <div className={styles.icon_wrapper}>
        <Icon isLoading={isLoading} config={config?.icon} />
      </div>
      <div className={`${styles.section_wrapper} section-wrapper`}>
        <Primary
          isLoading={isLoading}
          config={config?.primarySection}
          coreData={coreData}
          fieldValues={fieldValues}
        />
        <Secondary
          isLoading={isLoading}
          config={config?.secondarySection}
          coreData={coreData}
          fieldValues={fieldValues}
        />
        {config?.tertiarySection ? (
          <Tertiary isLoading={isLoading} config={config?.tertiarySection} coreData={coreData} />
        ) : null}
      </div>
    </div>
  );
};

Body.defaultProps = {
  fieldValues: undefined
};

export default Body;
