import { getEntityTabName } from 'common/component-lib/entity-tabs/utils/general';
import style from '../manage-tabs.module.css';
import Default from './Default';
import useEntityDetailStore, { useLeadRepName } from 'apps/entity-details/entitydetail.store';
interface ITitle {
  title: string;
  id: string;
  tabType: number;
}

const Title = ({ title, id, tabType }: ITitle): JSX.Element => {
  const leadRepName = useLeadRepName();
  const coreData = useEntityDetailStore((state) => state.coreData);

  return (
    <div className={style.title_wrapper}>
      <div className={style.tittle}>
        {getEntityTabName({
          tabName: title,
          leadRepName,
          tabType,
          entityDetailsType: coreData.entityDetailsType
        })}
      </div>
      <div>
        <Default id={id} />
      </div>
    </div>
  );
};

export default Title;
