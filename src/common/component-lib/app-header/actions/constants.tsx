import DraftsMenu from 'apps/forms/draft-menu/DraftsMenu';
import Search from './Search';
import SaveAsDraftCustomRenderer from './SaveAsDraftCustomRenderer';
import Help from './Help';
import { INavigationItem } from '../app-header.types';

export const ACTION_RENDERER_MAP: Record<string, (config?: INavigationItem) => JSX.Element | null> =
  {
    ['save-as-draft']: () => <DraftsMenu customRenderer={SaveAsDraftCustomRenderer} />,
    ['global-search']: Search,
    ['help-center']: (config: INavigationItem) => <Help config={config} />
  };
