import { trackError } from 'common/utils/experience/utils/track-error';
import { AvailableTheme, addPrimaryColorConfig } from '@lsq/nextgen-preact/v2/stylesmanager';
import { IUser } from 'common/types/authentication.types';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { persistAuthConfig } from 'common/utils/authentication/utils/authentication-utils';
import { getFromDB, setInDB, StorageKey } from 'common/utils/storage-manager';
import { reloadApp } from '../../store/reload-app';
import { setUserProfilePhoto, setUserProfileData } from '../../store/user-data';
import { showHeaderOverlay } from 'apps/header/header.store';
import { IThemeConfig } from '@lsq/nextgen-preact/v2/stylesmanager/theme.types';
import { onThemeUpdateCallback } from 'common/utils/helpers/helpers';

const hideConverse = (canHide: boolean): void => {
  try {
    const converseElement = document.getElementById('converseApp');
    if (converseElement) {
      converseElement.style.display = canHide ? 'none' : 'block';
    }
  } catch (error) {
    trackError(error);
  }
};

const updateSWLiteStorage = (authUserDetails: Record<string, string>): void => {
  try {
    const authData = getPersistedAuthConfig();
    if (!authData) return;

    const userData = authData?.User || {};

    Object.keys(authUserDetails || {}).map((key) => {
      // eslint-disable-next-line no-prototype-builtins
      if (userData.hasOwnProperty(key)) {
        userData[key] = authUserDetails[key];
      }
    });

    authData.User = userData;

    persistAuthConfig(authData);
  } catch (error) {
    trackError(error);
  }
};

const updateStorageForMarvinComponent = async (
  authUserDetails: Record<string, string>
): Promise<void> => {
  try {
    const authDataFromDB = (await getFromDB(StorageKey.PostLoginConfig)) as { User: IUser };
    const userDataFromDB = authDataFromDB.User;

    Object.keys(userDataFromDB || {}).map((key) => {
      // eslint-disable-next-line no-prototype-builtins
      if (authUserDetails.hasOwnProperty(key)) {
        userDataFromDB[key] = authUserDetails[key];
      }
    });
    authDataFromDB.User = userDataFromDB;
    await setInDB(StorageKey.PostLoginConfig, authDataFromDB);
  } catch (error) {
    trackError(error);
  }
};

const handleProfileUpdate = async ({
  authUserDetails
}: {
  authUserDetails: Record<string, string>;
}): Promise<void> => {
  try {
    if (
      // eslint-disable-next-line no-prototype-builtins
      authUserDetails?.hasOwnProperty('FirstName') &&
      // eslint-disable-next-line no-prototype-builtins
      authUserDetails?.hasOwnProperty('LastName')
    ) {
      authUserDetails.FullName = `${authUserDetails.FirstName} ${authUserDetails.LastName}`;
    }
    setUserProfileData(authUserDetails?.FullName, authUserDetails?.AssociatedPhoneNumbers);
    updateSWLiteStorage(authUserDetails);
    await updateStorageForMarvinComponent(authUserDetails);
  } catch (error) {
    trackError(error);
  }
};

const onProfilePictureUpdate = async (photoUrl: string): Promise<void> => {
  try {
    setUserProfilePhoto(photoUrl);
    updateSWLiteStorage({ ProfilePhoto: photoUrl });
    await updateStorageForMarvinComponent({ ProfilePhoto: photoUrl });
  } catch (error) {
    trackError(error);
  }
};

interface IOnMessageReceive {
  data: { type: string; message: Record<string, unknown> };
  setTheme: (
    themeName: AvailableTheme,
    primaryColorConfig: IThemeConfig,
    onThemeUpdate?: (selectedThemeConfig: { [x: string]: string | boolean }) => void
  ) => void;
}

export const onMessageReceive = async ({ data, setTheme }: IOnMessageReceive): Promise<void> => {
  try {
    const events = {
      ['SWLITE_THEME_UPDATE']: (): void => {
        setTheme(
          data?.message?.theme as AvailableTheme,
          addPrimaryColorConfig({
            ...getPersistedAuthConfig()?.LaunchConfig
          }),
          onThemeUpdateCallback
        );
      },
      ['SWLITE_HIDE_CONVERSE']: (): void => {
        hideConverse((data?.message?.canHide as boolean) || false);
      },
      ['SWLITE_USER_PHOTO_URL']: async (): Promise<void> => {
        await onProfilePictureUpdate(data?.message?.photoUrl as string);
      },
      ['SWLITE_PROFILE_UPDATE']: async (): Promise<void> => {
        await handleProfileUpdate(
          data?.message as {
            authUserDetails: Record<string, string>;
          }
        );
      },
      ['SWLITE_MODAL_TRIGGER']: (): void => {
        showHeaderOverlay((data?.message?.isModalOpened as boolean) || false);
      },
      ['SWLITE_RELOAD_APP']: (): void => {
        //Reload the app for Date format and Timezone changes
        reloadApp(!!data?.message?.canReloadApp);
      }
    };

    await events?.[data.type]?.();
  } catch (error) {
    trackError(error);
  }
};
