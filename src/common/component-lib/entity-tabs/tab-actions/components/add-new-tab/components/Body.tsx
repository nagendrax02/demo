import Modal from '@lsq/nextgen-preact/modal';
import FormField from 'common/component-lib/form-field';
import useAddNewTab from '../add-new-tab-store';
import styles from '../add-new-tab.module.css';
import SetAsDefault from './SetAsDefault';
import { InputId } from '../add-new-tab.types';
import { fetchOptions } from 'apps/activity-history/components/filters/type-filter/utils';
import AddNewTabShimmer from './AddNewTabShimmer';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Input = withSuspense(lazy(() => import('@lsq/nextgen-preact/input')));

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

interface IBody {
  coreData: IEntityDetailsCoreData;
}

const Body = (props: IBody): JSX.Element => {
  const { coreData } = props;
  const { events, setEvents, tabName, setTabName, error } = useAddNewTab();

  const { entityDetailsType, eventCode } = coreData;
  const eventCodeString = eventCode ? `${eventCode}` : undefined;

  const errorMessage = 'Required Field';
  return (
    <Modal.Body>
      <div
        className={`${styles.body} ${events?.length ? '' : styles.dropdown_placeholder}`}
        data-testid="add-new-tab-body">
        <FormField
          title="Tab Name"
          errorMessage={error === InputId.Input ? errorMessage : ''}
          dataTestId="add-new-tab-name"
          suspenseFallback={<AddNewTabShimmer marginBottom="16px" />}>
          <Input
            value={tabName}
            setValue={(value: string): void => {
              setTabName(value);
            }}
            id={InputId.Input}
            placeholder="Enter Tab Name"
            error={error === InputId.Input}
            focusOnMount
            dataTestId="add-new-tab-input"
            suspenseFallback={<AddNewTabShimmer />}
            maxLength={30}
          />
        </FormField>

        <FormField
          title="Notable Activities"
          errorMessage={error === InputId.Dropdown ? errorMessage : ''}
          dataTestId="add-new-tab-filter"
          suspenseFallback={<AddNewTabShimmer marginBottom="16px" />}>
          <Dropdown
            fetchOptions={(searchText: string) =>
              fetchOptions({
                searchText,
                type: entityDetailsType,
                eventCode: eventCodeString
              })
            }
            isMultiselect
            selectedValues={events}
            showDefaultFooter
            setSelectedValues={setEvents}
            placeHolderText="Selected Notable Activities"
            inputId={InputId.Dropdown}
            error={error === InputId.Dropdown}
            adjustHeight
            doNotSelfPosition
            suspenseFallback={<AddNewTabShimmer />}
          />
        </FormField>

        <SetAsDefault />
      </div>
    </Modal.Body>
  );
};

export default Body;
