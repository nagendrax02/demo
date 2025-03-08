import { INavigationItem } from '../../../app-header.types';
import NoResultsFound from '../NoResultsFound';
import Module from './Module';
import styles from './modules.module.css';

interface IModulesProps {
  modules: INavigationItem[];
  activeModule?: INavigationItem;
  onModuleHover: (module: INavigationItem) => void;
  handleModuleClick: (id: string) => void;
}

/**
 * Displays a list of all available modules.
 */

const Modules = ({
  modules,
  activeModule,
  onModuleHover,
  handleModuleClick
}: IModulesProps): JSX.Element => {
  if (modules?.length) {
    return (
      <div className={styles.container}>
        {modules.map((item) => {
          return (
            <Module
              key={item?.Id}
              data={item}
              isActive={activeModule?.Id === item?.Id}
              onModuleHover={onModuleHover}
              handleModuleClick={handleModuleClick}
            />
          );
        })}
      </div>
    );
  }
  return <NoResultsFound />;
};

export default Modules;
