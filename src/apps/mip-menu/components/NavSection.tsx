import { IHeader } from '../header.types';
import styles from '../header.module.css';
import ActionMenu from '@lsq/nextgen-preact/action-menu';
import { augmentMenuItem, replaceRepName } from '../utils';
import Icon from '@lsq/nextgen-preact/icon';
import Dashboard from './dashboard/Dashboard';
import ItemLink from './ItemLink';
import React, { useEffect, useState } from 'react';
import { isDashboardPage } from 'common/component-lib/mip-header/utils';
import { CallerSource } from 'common/utils/rest-client';
import { fetchRepresentationName } from 'common/utils/entity-data-manager/lead/metadata';
import { IEntityRepresentationName } from '../../entity-details/types/entity-data.types';
import { DEFAULT_LEAD_REPRESENTATION_NAME } from 'common/component-lib/send-email/constants';

interface INavItem {
  items: IHeader[];
}

const getCaption = (item: IHeader): React.ReactNode => {
  const onDashboardPage = isDashboardPage();

  if (item?.Path?.toLowerCase() === 'dashboard') {
    if (item.Caption === 'Home')
      return (
        <div
          className={`${styles.item}`}
          onClick={() => {
            if (!onDashboardPage) window.location.href = `/${item.ControllerName}`;
          }}
          role="button">
          {item.Caption}
        </div>
      );

    return (
      <Dashboard>
        <div className={styles.item}>
          {item.Caption} <Icon name="arrow_drop_down" />
        </div>
      </Dashboard>
    );
  }
  return <ItemLink item={item} customClass={styles.link_menu} />;
};

const NavItems = ({ items }: INavItem): JSX.Element => {
  const [leadRepName, setLeadRepName] = useState<IEntityRepresentationName>(
    DEFAULT_LEAD_REPRESENTATION_NAME
  );

  useEffect(() => {
    (async (): Promise<void> => {
      const response = await fetchRepresentationName(CallerSource.MiPNavMenu);
      if (response) setLeadRepName(response);
    })();
  }, []);

  return (
    <div className={styles.items_wrapper}>
      {items.map((item) => (
        <div key={item.Id} className={`${styles.item_wrapper}`}>
          {item.Children?.length ? (
            <ActionMenu
              menuKey={item.Id}
              actions={augmentMenuItem({ items: item.Children, leadRepName })}>
              <div className={styles.item}>
                <div className={styles.link_menu}>{replaceRepName(item, leadRepName)}</div>
                <Icon name="arrow_drop_down" />
              </div>
            </ActionMenu>
          ) : (
            <> {getCaption(item)}</>
          )}
        </div>
      ))}
    </div>
  );
};

export default React.memo(NavItems);
