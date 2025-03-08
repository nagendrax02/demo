import { INavigationItem } from '../app-header.types';
import styles from './actions.module.css';
import { ACTION_RENDERER_MAP } from './constants';

interface IActionsProps {
  data: INavigationItem[];
}

const Actions = ({ data }: IActionsProps): JSX.Element => {
  return (
    <div className={styles.container}>
      {data?.map((item) => {
        if (ACTION_RENDERER_MAP?.[item?.Id]) {
          return ACTION_RENDERER_MAP?.[item?.Id](item);
        }
      })}
    </div>
  );
};

export default Actions;
