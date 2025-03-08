import { trackError } from 'common/utils/experience/utils/track-error';
import {
  getCallerSource,
  getConvertedMoreActions,
  getFilteredProcessActions
} from '../utils/utils';
import { useEffect, useState } from 'react';
import HandleAction from '../handle-action';
import {
  IActionMenuItem,
  IEntityDetailsCoreData
} from 'apps/entity-details/types/entity-data.types';
import { IProcessFormsData } from 'common/utils/process/process.types';
import MoreActionMenu from './MoreActionMenu';

interface IMoreAction {
  actions: IActionMenuItem[];
  coreData: IEntityDetailsCoreData;
  customClass?: string;
  onSuccess?: () => void;
  isSmartviews?: boolean;
  setIsMenuOpen?: (show: boolean) => void;
  customButton?: () => JSX.Element;
  customConfig?: Record<string, string>;
  menuDimension?: Record<string, number>;
  entityRecords?: Record<string, unknown>[];
  renderAsV2Component?: boolean;
  entityName?: string;
}

const MoreActions = ({
  actions,
  coreData,
  onSuccess,
  customButton,
  customClass,
  customConfig,
  isSmartviews,
  setIsMenuOpen,
  menuDimension,
  entityRecords,
  renderAsV2Component,
  entityName
}: IMoreAction): JSX.Element => {
  const [actionClicked, setActionClicked] = useState<IActionMenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processFormsData, setProcessFormsData] = useState<IProcessFormsData | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (!isSmartviews) {
          setIsLoading(true);
          const fetchData = (await import('common/utils/process/process'))
            .fetchMultipleWorkAreaProcessForms;
          const processForms = await fetchData(
            getFilteredProcessActions(actions as IActionMenuItem[]),
            getCallerSource()
          );
          if (processForms) setProcessFormsData(processForms);
        }
      } catch (error) {
        trackError(error);
      }
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!actions?.length) return <></>;
  const convertedActions = isSmartviews
    ? actions
    : getConvertedMoreActions(actions, processFormsData, isLoading);

  return (
    <>
      <MoreActionMenu
        renderAsV2Component={renderAsV2Component}
        setIsMenuOpen={setIsMenuOpen}
        actions={convertedActions}
        menuDimension={menuDimension}
        coreData={coreData}
        customButton={customButton}
        customClass={customClass}
        customConfig={customConfig}
        setActionClicked={setActionClicked}
        onSuccess={onSuccess}
      />
      {actionClicked ? (
        <HandleAction
          coreData={coreData}
          action={actionClicked}
          customConfig={customConfig}
          setActionClicked={setActionClicked}
          onSuccess={onSuccess}
          isSmartviews={isSmartviews}
          entityRecords={entityRecords}
          entityName={entityName}
        />
      ) : null}
    </>
  );
};

MoreActions.defaultProps = {
  menuDimension: undefined,
  customClass: '',
  customConfig: {},
  isSmartviews: false,
  onSuccess: (): void => {},
  customButton: undefined,
  setIsMenuOpen: undefined,
  entityRecords: undefined,
  renderAsV2Component: false
};

export default MoreActions;
