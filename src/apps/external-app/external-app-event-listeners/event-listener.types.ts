interface IProcessor {
  [Key: string]: (event: MessageEvent) => Promise<void> | void;
}

enum ProcessorType {
  GetContext = 'get_context',
  Default = 'default',
  OnThemeChange = 'on_theme_change',
  OnLanguageChange = 'on_language_change',
  OnSignOut = 'on_sign_out',
  OpenForm = 'open_form',
  ShowAlert = 'show_alert',
  ShowTour = 'show_tour',
  OpenEntityDetails = 'open_entity_details',
  GetProcessForms = 'get_process_forms',
  Reload = 'reload',
  SignOut = 'sign_out',
  OnClick2Call = 'on_click_2_call',
  ReIssueTokens = 're_issue_tokens',
  OnBroadcastMessageReceived = 'on_broadcast_message_received',
  BroadcastMessage = 'broadcast_message',
  CloseEntityDetails = 'close_entity_details',
  UpdateUrl = 'update_url',
  ActionRegistration = 'action_registration',
  ActionRegistrationResponse = 'action_registration_response',
  TriggerCall = 'trigger_call',
  OpenInNewTab = 'open_in_new_tab',
  SubscribeToBroadcast = 'subscribe_to_broadcast',
  SubscribeToExternalAppLoad = 'subscribe_to_external_app_load'
}

enum EntityFieldType {
  Lead = 'lead',
  Activity = 'activity',
  CustomObject = 'customObject',
  Task = 'task',
  Opportunity = 'opportunity'
}

interface IAssociatedEntityDetails {
  entityId: string;
  entityType: EntityFieldType;
  entityCode?: string;
}

interface IClick2Call {
  phoneNumber: string;
  schemaName: string;
  leadId: string;
  leadName: string;
  entityType: EntityFieldType;
  associatedEntityDetails?: IAssociatedEntityDetails;
}

export { ProcessorType, EntityFieldType };

export type { IProcessor, IClick2Call };
