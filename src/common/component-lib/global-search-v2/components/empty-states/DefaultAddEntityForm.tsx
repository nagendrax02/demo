import { defaultAddEntityFormConfig } from '../../utils/utils';
import { EntityType, Variant } from 'common/types';
import styles from './empty-states.module.css';
import AddLeadIcon from 'assets/custom-icon/AddLeadIcon';
import useGlobalSearchStore from '../../global-searchV2.store';
import { Button } from '@lsq/nextgen-preact/v2/button';
import { IDefaultEntityConfig } from '../../global-searchV2.types';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

const DefaultAddEntityForm: React.FC = () => {
  const entityType: EntityType = useGlobalSearchStore((state) => state.filters.entityType);
  const {
    id,
    modalTitle: title,
    buttonText
  }: IDefaultEntityConfig = defaultAddEntityFormConfig(entityType);

  const handleClick = async (): Promise<void> => {
    const processActionClickHandler = await import(
      'apps/entity-details/components/vcard/actions/button-actions/button-action-handler'
    );

    const augmentedAction = {
      id: id || '',
      title
    };

    const formConfig = await processActionClickHandler.getFormConfig({
      action: augmentedAction,
      onShowFormChange: (showForm: boolean) => {
        if (!showForm) {
          useFormRenderer.getState().setFormConfig(null);
        }
      }
    });
    useFormRenderer.getState().setFormConfig(formConfig);
  };

  return (
    <div>
      <Button
        variant={Variant.Secondary}
        text={buttonText}
        customStyleClass={styles.add_lead}
        icon={<AddLeadIcon />}
        onClick={handleClick}
      />
    </div>
  );
};

export default DefaultAddEntityForm;
