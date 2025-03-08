import { z } from 'zod';

export interface IHomeConfiguration {
  Id: string;
  Label: string;
  DashboardURL: string;
  HomePageURL: string;
  IsCasaEnabled: boolean;
  IsSieraEnabled: boolean;
}

export interface INavigationItem {
  Id: string;
  Label: string;
  Path: string | null;
  IframeURL: string | null;
  SubMenu: INavigationItem[] | null;
  IsGroupMenu: boolean | null;
  IsHiddenFromNavBar: boolean | null;
}

export interface IAppHeaderData {
  HomeConfiguration: IHomeConfiguration;
  NavigationMenu: INavigationItem[];
  Actions: INavigationItem[];
  // ProfileMenu: IProfileMenu[];
  // HelpMenu: IHelpMenu[];
}

export interface INavigationReferenceItem {
  data: INavigationItem;
  rootModuleId: string;
  leafModuleItemId: string;
}

export type INavigationReferenceMap = Record<string, INavigationReferenceItem>;

export interface IAppHeaderStore {
  isLoading: boolean;
  appHeaderData: IAppHeaderData;
  navigationReferenceMap: INavigationReferenceMap;
  selectedModuleId: string;
  selectedModuleItemId: string;
}

export const HomeConfigurationSchema: z.ZodType<IHomeConfiguration> = z.lazy(() =>
  z.object({
    Id: z.string(),
    Label: z.string(),
    DashboardURL: z.string(),
    HomePageURL: z.string(),
    IsCasaEnabled: z.boolean(),
    IsSieraEnabled: z.boolean()
  })
);

export const NavigationItemSchema: z.ZodType<INavigationItem> = z.lazy(() =>
  z.object({
    Id: z.string(),
    Label: z.string(),
    Path: z.string().nullable(),
    IframeURL: z.string().nullable(),
    SubMenu: z
      .array(NavigationItemSchema)
      .nullable()
      .transform((val) => val ?? []),
    IsGroupMenu: z
      .boolean()
      .nullable()
      .transform((val) => val ?? false),
    IsHiddenFromNavBar: z
      .boolean()
      .nullable()
      .transform((val) => val ?? false)
  })
);

export const AppHeaderSchema = z.object({
  HomeConfiguration: HomeConfigurationSchema,
  NavigationMenu: z.array(NavigationItemSchema),
  Actions: z.array(NavigationItemSchema)
  // ProfileMenu: z.array(ProfileMenuSchema),
});
