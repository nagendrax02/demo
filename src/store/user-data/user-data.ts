import { getPersistedAuthConfig } from 'common/utils/authentication';
import { create } from 'zustand';

export interface IUserDataStore {
  profilePhoto: string;
  userFullName: string;
  associatedPhoneNumbers: string;
}

const userDataStore = create<IUserDataStore>(() => {
  const userAuthConfig = getPersistedAuthConfig()?.User;
  return {
    userFullName: userAuthConfig?.FullName || '',
    profilePhoto: userAuthConfig?.ProfilePhoto || '',
    associatedPhoneNumbers: userAuthConfig?.AssociatedPhoneNumbers || ''
  };
});

export const setUserProfilePhoto = (photoUrl: string): void => {
  userDataStore.setState(() => ({ profilePhoto: photoUrl }));
};

export const setUserProfileData = (fullName: string, associatedPhoneNumbers: string): void => {
  userDataStore.setState(() => ({ userFullName: fullName, associatedPhoneNumbers }));
};

export const setUserAssociatedPhoneNumbers = (associatedPhoneNumbers: string): void => {
  userDataStore.setState(() => ({ associatedPhoneNumbers: associatedPhoneNumbers }));
};

export default userDataStore;
