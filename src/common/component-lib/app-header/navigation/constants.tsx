import {
  Ace,
  AppsAndConnectors,
  Casa,
  ContentLibrary,
  FieldSales,
  LeadsHub,
  Marketing,
  TicketManagement,
  Workflow
} from 'assets/product-icons';
import { JourneysIcon, LocationInsightsIcon, TerritoriesIcon } from 'assets/brand-logos';

export const MODULE_ICON_MAP: Record<string, JSX.Element> = {
  ['80']: <Ace />,
  ['60']: <AppsAndConnectors />,
  ['casa-builder']: <Casa />,
  ['20']: <ContentLibrary />,
  ['fieldSales']: <FieldSales />,
  ['40']: <LeadsHub />,
  ['30']: <Marketing />,
  ['service-management']: <TicketManagement />,
  ['50']: <Workflow />
};

export const BRAND_ICON_MAP: Record<string, JSX.Element> = {
  ['fieldsales-location-insights']: <LocationInsightsIcon />,
  ['fieldsales-journey']: <JourneysIcon />,
  ['fieldsales-territory-management']: <TerritoriesIcon />
};

export const PRODUCT_BADGE_TEXT_MAP = {
  ['80']: 'ACE',
  ['casa-builder']: 'Casa'
};
