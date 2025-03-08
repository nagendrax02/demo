import { ComponentType, IComponent } from '../../types';
import Badge from './badge';
import QuickAction from './quick-action';
import Icon from './icon';
import MetaData from './metadata';
import Title from './title';
import Actions from './actions';
import styles from './vcard.module.css';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import MaterialIcon from '@lsq/nextgen-preact/icon';
import { IEntityDetailsCoreData } from '../../types/entity-data.types';

interface IComponentRenderer {
  isLoading: boolean;
  coreData: IEntityDetailsCoreData;
  components: IComponent[] | undefined;
  fieldValues?: Record<string, string | null>;
}

const getComponent = (type: ComponentType): ((...props) => JSX.Element) => {
  switch (type) {
    case ComponentType.Title:
      return Title;
    case ComponentType.Badge:
      return Badge;
    case ComponentType.Icon:
      return Icon;
    case ComponentType.QuickAction:
      return QuickAction;
    case ComponentType.Action:
      return Actions;
    case ComponentType.MetaData:
      return MetaData;
    default:
      // eslint-disable-next-line react/display-name
      return () => <></>;
  }
};

const getSeperator = (): JSX.Element => {
  return (
    <MaterialIcon
      name="fiber_manual_record"
      customStyleClass={styles.field_seperator}
      variant={IconVariant.Filled}
    />
  );
};

const ComponentRenderer = ({
  isLoading,
  components,
  coreData,
  fieldValues
}: IComponentRenderer): JSX.Element => {
  if (components) {
    return (
      <>
        {components?.map((comp, index) => {
          const Component = getComponent(comp?.type);
          return (
            <>
              <Component
                key={`vcard_component_${index + 1}`}
                isLoading={isLoading}
                config={comp.config}
                coreData={coreData}
                customStyleClass={comp.customStyleClass}
                fieldValues={fieldValues}
              />
              {comp?.showFieldSeperator ? getSeperator() : null}
            </>
          );
        })}
      </>
    );
  }

  return <></>;
};

ComponentRenderer.defaultProps = {
  fieldValues: undefined
};
export default ComponentRenderer;
export { getComponent };
