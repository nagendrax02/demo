import React, { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { useBulkUpdate } from '../bulk-update.store';
import { AugmentedRenderType } from '../bulk-update.types';
import Textbox from './Textbox';
import { withShimmer } from './withShimmer';

const BulkUpdateCheckBox = withShimmer(lazy(() => import('./BulkUpdateCheckBox')));
const BulkUpdateDate = withShimmer(lazy(() => import('./BulkUpdateDate')));
const BulkUpdateDateTime = withShimmer(lazy(() => import('./BulkUpdateDateTime')));
const BulkUpdateDropdown = withShimmer(lazy(() => import('./BulkUpdateDropdown')));
const BulkUpdateEditor = withShimmer(lazy(() => import('./BulkUpdateEditor')));
const BulkUpdateEmail = withShimmer(lazy(() => import('./BulkUpdateEmail')));
const BulkUpdateNumber = withShimmer(lazy(() => import('./BulkUpdateNumber')));
const BulkUpdateOtherDropdown = withShimmer(
  withSuspense(lazy(() => import('./BulkUpdateOtherDropdown')))
);
const BulkUpdateOwner = withShimmer(lazy(() => import('./BulkUpdateOwner')));
const BulkUpdatePhone = withShimmer(lazy(() => import('./BulkUpdatePhone')));
const BulkUpdateRadio = withShimmer(lazy(() => import('./BulkUpdateRadio')));
const BulkUpdateTextArea = withShimmer(lazy(() => import('./BulkUpdateTextArea')));
const BulkUpdateAssociatedAccounts = withShimmer(
  lazy(() => import('./BulkUpdateAssociatedAccounts'))
);
const BulkUpdateProduct = withShimmer(lazy(() => import('./BulkUpdateProduct')));

const Rendered = (): JSX.Element => {
  const selectedOption = useBulkUpdate((state) => state.selectedField);

  const getFields = (): JSX.Element => {
    if (!selectedOption) {
      return <Textbox disabled />;
    }

    const componentMapper = {
      [AugmentedRenderType.SearchableDropDown]: <BulkUpdateDropdown field={selectedOption} />,
      [AugmentedRenderType.LargeOptionSet]: <BulkUpdateDropdown field={selectedOption} />,
      [AugmentedRenderType.DropdownWithOthers]: <BulkUpdateOtherDropdown field={selectedOption} />,
      [AugmentedRenderType.Dropdown]: <BulkUpdateDropdown field={selectedOption} />,
      [AugmentedRenderType.MultiselectDropdown]: <BulkUpdateDropdown field={selectedOption} />,
      [AugmentedRenderType.Checkbox]: <BulkUpdateCheckBox field={selectedOption} />,
      [AugmentedRenderType.TextArea]: <BulkUpdateTextArea field={selectedOption} />,
      [AugmentedRenderType.Editor]: <BulkUpdateEditor field={selectedOption} />,
      [AugmentedRenderType.Email]: <BulkUpdateEmail field={selectedOption} />,
      [AugmentedRenderType.Date]: <BulkUpdateDate />,
      [AugmentedRenderType.Time]: <BulkUpdateDate isTimePicker />,
      [AugmentedRenderType.DateTime]: <BulkUpdateDateTime />,
      [AugmentedRenderType.ActiveUsers]: <BulkUpdateOwner />,
      [AugmentedRenderType.Number]: <BulkUpdateNumber field={selectedOption} />,
      [AugmentedRenderType.RadioButtons]: <BulkUpdateRadio />,
      [AugmentedRenderType.Phone]: <BulkUpdatePhone />,
      [AugmentedRenderType.AssociatedDropdown]: <BulkUpdateAssociatedAccounts />,
      [AugmentedRenderType.Product]: <BulkUpdateProduct field={selectedOption} />
    };

    return (componentMapper[selectedOption?.augmentedRenderType] as JSX.Element) || <Textbox />;
  };

  return <div key={selectedOption?.value}>{getFields()}</div>;
};

export default React.memo(Rendered);
