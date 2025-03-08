import { ModalHeader } from '@lsq/nextgen-preact/v2/modal';
import { ENTITY_DISPLAY_NAME, IHeaderConfig } from './config';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import styles from './tab-settings.module.css';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { HeaderAction } from 'apps/smart-views/constants/constants';
import Badge from '@lsq/nextgen-preact/v2/badge';
import { useMaxAllowedSelection, useSelectedFields } from './tab-settings.store';
import { classNames } from 'common/utils/helpers/helpers';

interface IHeader {
  onClose: () => void;
  config: IHeaderConfig | undefined;
  selectedAction: IMenuItem | null;
  entityRepName?: IEntityRepresentationName | undefined;
}

const Header = (props: IHeader): JSX.Element => {
  const { onClose, config, entityRepName, selectedAction } = props;

  const selectedFields = useSelectedFields();
  const maxAllowed = useMaxAllowedSelection();

  return (
    <ModalHeader
      onClose={onClose}
      title={
        <div className={classNames(styles.modal_header_title, 'ng_h_3_b', 'ng_v2_style')}>
          {config?.title
            ? config?.title?.replace(ENTITY_DISPLAY_NAME, entityRepName?.SingularName || 'Lead')
            : ''}
          {selectedAction?.value === HeaderAction.ManageFilters ? (
            <Badge
              size="md"
              status={selectedFields?.length === maxAllowed ? 'failed' : 'neutral'}
              type="regular">
              {`${selectedFields?.length}/${maxAllowed}`}
            </Badge>
          ) : null}
        </div>
      }
      description={config?.subtitle || ''}
    />
  );
};

export default Header;
