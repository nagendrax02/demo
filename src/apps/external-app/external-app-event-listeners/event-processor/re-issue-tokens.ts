import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource } from 'src/common/utils/rest-client';

const reIssueTokens = async (event: MessageEvent): Promise<void> => {
  try {
    const module = await import('common/utils/authentication');
    const reIssuedTokens = await module.getReIssuedTokens(CallerSource.ExternalApp);
    if (event.ports[0]) event.ports[0].postMessage(reIssuedTokens);
  } catch (ex) {
    trackError('Error in reIssueTokens :', ex);
  }
};

export default reIssueTokens;
