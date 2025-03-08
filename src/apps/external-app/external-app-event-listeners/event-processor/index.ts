import getContextProcessor from './get-context';
import defaultProcessor from './default';
import themeChangeProcessor from './theme-change';
import languageChangeProcessor from './language-change';
import onSignOutProcessor from './on-sign-out';
import openFormProcessor from './open-form';
import showAlertProcessor from './show-alert';
import openEntityDetailsProcessor from './open-entity-details';
import getProcessFormsProcessor from './get-process-forms';
import reloadProcessor from './reload';
import signOutProcessor from './sign-out';
import reIssueTokens from './re-issue-tokens';
import onBroadCastMessageReceived from './on-broadcast-message-received';
import broadcastMessage from './broadcast-message';
import showTourProcessor from './show-tour';
import closeEntityDetails from './close-entity-details';
import updateUrlProcessor from './update-url';
import invokeClick2CallProcessor from './invoke-click-2-call';
import openInNewTabProcessor from './open-in-new-tab';
import subscribeToBroadcast from './subscribe-to-broadcast';
import { IProcessor, ProcessorType } from '../event-listener.types';
import { onClick2CallProcessor } from './on-click-2-call';
import actionRegistrationProcessor, {
  actionRegistrationResponse
} from './register-external-app-action';
import subscribeToExternalAppLoad from './subscribe-to-external-app-load';

const processor: IProcessor = {
  [ProcessorType.GetContext]: getContextProcessor,
  [ProcessorType.Default]: defaultProcessor,
  [ProcessorType.OnThemeChange]: themeChangeProcessor,
  [ProcessorType.OnLanguageChange]: languageChangeProcessor,
  [ProcessorType.OnSignOut]: onSignOutProcessor,
  [ProcessorType.OpenForm]: openFormProcessor,
  [ProcessorType.ShowAlert]: showAlertProcessor,
  [ProcessorType.ShowTour]: showTourProcessor,
  [ProcessorType.OpenEntityDetails]: openEntityDetailsProcessor,
  [ProcessorType.GetProcessForms]: getProcessFormsProcessor,
  [ProcessorType.Reload]: reloadProcessor,
  [ProcessorType.SignOut]: signOutProcessor,
  [ProcessorType.OnClick2Call]: onClick2CallProcessor,
  [ProcessorType.ReIssueTokens]: reIssueTokens,
  [ProcessorType.OnBroadcastMessageReceived]: onBroadCastMessageReceived,
  [ProcessorType.BroadcastMessage]: broadcastMessage,
  [ProcessorType.CloseEntityDetails]: closeEntityDetails,
  [ProcessorType.UpdateUrl]: updateUrlProcessor,
  [ProcessorType.ActionRegistration]: actionRegistrationProcessor,
  [ProcessorType.ActionRegistrationResponse]: actionRegistrationResponse,
  [ProcessorType.TriggerCall]: invokeClick2CallProcessor,
  [ProcessorType.OpenInNewTab]: openInNewTabProcessor,
  [ProcessorType.SubscribeToBroadcast]: subscribeToBroadcast,
  [ProcessorType.SubscribeToExternalAppLoad]: subscribeToExternalAppLoad
};

export default processor;
