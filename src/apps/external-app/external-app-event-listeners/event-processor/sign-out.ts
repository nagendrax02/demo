import { trackError } from 'common/utils/experience/utils/track-error';
const signOutProcessor = async (): Promise<void> => {
  try {
    const module = await import('common/utils/authentication/utils/logout');
    module.logout();
  } catch (ex) {
    trackError('Error in signOut:', ex);
  }
};

export default signOutProcessor;
