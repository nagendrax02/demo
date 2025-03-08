import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Edit = withSuspense(lazy(() => import('./Edit')));
const Delete = withSuspense(lazy(() => import('./Delete')));
const CustomActivity = withSuspense(lazy(() => import('./CustomActivity')));
const Call = withSuspense(lazy(() => import('./Call')));
const Share = withSuspense(lazy(() => import('./Share')));
const ChangeOwner = withSuspense(lazy(() => import('./ChangeOwner')));
const ChangeStage = withSuspense(lazy(() => import('./ChangeStage')));
const Converse = withSuspense(lazy(() => import('./Converse')));
const AddOpportunity = withSuspense(lazy(() => import('./AddOpportunity')));
const AddTask = withSuspense(lazy(() => import('./AddTask')));
const AddActivity = withSuspense(lazy(() => import('./AddActivity')));
const Form = withSuspense(lazy(() => import('./Form')));
const AddAccountActivity = withSuspense(lazy(() => import('./AddAccountActivity')));
const SharedEmail = withSuspense(lazy(() => import('./SharedEmail')));
const AddNote = withSuspense(lazy(() => import('./AddNote')));
const Done = withSuspense(lazy(() => import('./Done')));
const Cancel = withSuspense(lazy(() => import('./Cancel')));
const SaveContact = withSuspense(lazy(() => import('./SaveContact')));
const AddToList = withSuspense(lazy(() => import('./AddToList')));
const Mail = withSuspense(lazy(() => import('./Mail')));
const Add = withSuspense(lazy(() => import('./Add')));
const AddLead = withSuspense(lazy(() => import('./AddLead')));
const Lead = withSuspense(lazy(() => import('./Lead')));
const Opportunity = withSuspense(lazy(() => import('./Opportunity')));
const Task = withSuspense(lazy(() => import('./Task')));
const Mavis = withSuspense(lazy(() => import('./Mavis')));
const LeadIcon = withSuspense(lazy(() => import('./LeadIcon')));
const Custom = withSuspense(lazy(() => import('./Custom')));
const Activity = withSuspense(lazy(() => import('./Activity')));
const Accounts = withSuspense(lazy(() => import('./Accounts')));
const AccountActivity = withSuspense(lazy(() => import('./AccountActivity')));
const LeftPanelCollapse = withSuspense(lazy(() => import('./LeftPanelCollapse')));
const MoveToLeft = withSuspense(lazy(() => import('./MoveToLeft')));
const AddEmptyList = withSuspense(lazy(() => import('./AddEmptyList')));
const ViewConfig = withSuspense(lazy(() => import('./ViewConfig')));
const Reload = withSuspense(lazy(() => import('./Reload')));
const AddAccount = withSuspense(lazy(() => import('./AddAccount')));
const ArrowDown = withSuspense(lazy(() => import('./ArrowDown')));
const Close = withSuspense(lazy(() => import('./Close')));
const Option = withSuspense(lazy(() => import('./Option')));
const AddIcon = withSuspense(lazy(() => import('./AddIcon')));
const Sync = withSuspense(lazy(() => import('./Sync')));
const LeadList = withSuspense(lazy(() => import('./LeadList')));
const DateAndTime = withSuspense(lazy(() => import('./DateAndTime')));
const GoTo = withSuspense(lazy(() => import('./GoTo')));
const EditTask = withSuspense(lazy(() => import('./EditTask')));
const MarkOpen = withSuspense(lazy(() => import('./MarkOpen')));
const AutomationReport = withSuspense(lazy(() => import('./AutomationReport')));
const Sales = withSuspense(lazy(() => import('./Sales')));
const Time = withSuspense(lazy(() => import('./Time')));
const BackAndForward = withSuspense(lazy(() => import('./BackAndForward')));
const Information = withSuspense(lazy(() => import('./Information')));
const DateAndTimeFilled = withSuspense(lazy(() => import('./DateAndTimeFilled')));
const EmailSchedule = withSuspense(lazy(() => import('./EmailSchedule')));
const CustomActivityInbound = withSuspense(lazy(() => import('./CustomActivityInbound')));
const CustomActivityOutbound = withSuspense(lazy(() => import('./CustomActivityOutbound')));
const Email = withSuspense(lazy(() => import('./Email')));
const EmailClicked = withSuspense(lazy(() => import('./EmailClicked')));
const EmailRepliedActivity = withSuspense(lazy(() => import('./EmailReplied')));
const EmailSent = withSuspense(lazy(() => import('./EmailSent')));
const FormSubmitted = withSuspense(lazy(() => import('./FormSubmitted')));
const Activities = withSuspense(lazy(() => import('./Activities')));
const InboundPhoneCall = withSuspense(lazy(() => import('./InboundPhoneCall')));
const LeadCaptured = withSuspense(lazy(() => import('./LeadCaptured')));
const NeutralEmail = withSuspense(lazy(() => import('./NeutralEmail')));
const OpenedMail = withSuspense(lazy(() => import('./OpenedMail')));
const OpportunityCaptured = withSuspense(lazy(() => import('./OpportunityCaptured')));
const OpportunityChangeLog = withSuspense(lazy(() => import('./OpportunityChangeLog')));
const PortalActivity = withSuspense(lazy(() => import('./PortalActivity')));
const PositiveMail = withSuspense(lazy(() => import('./PositiveMail')));
const Privacy = withSuspense(lazy(() => import('./Privacy')));
const WebActivity = withSuspense(lazy(() => import('./WebActivity')));
const OutboundPhoneCall = withSuspense(lazy(() => import('./OutboundPhoneCall')));
const RestrictedEye = withSuspense(lazy(() => import('./RestrictedEye')));
const Star = withSuspense(lazy(() => import('./Star')));
const CallChannel = withSuspense(lazy(() => import('./CallChannel')));
const Message = withSuspense(lazy(() => import('./Message')));
const EmailChannel = withSuspense(lazy(() => import('./EmailChannel')));
const NoChannel = withSuspense(lazy(() => import('./NoChannel')));
const Home = withSuspense(lazy(() => import('./Home')));
const Copy = withSuspense(lazy(() => import('./Copy')));
const StatusIcon = withSuspense(lazy(() => import('./StatusIcon')));
const EmailOptOut = withSuspense(lazy(() => import('./EmailOptOut')));
const DeleteRecurrence = withSuspense(lazy(() => import('./DeleteRecurrence')));
const AssignLead = withSuspense(lazy(() => import('./AssignLead')));
const SaveToDraft = withSuspense(lazy(() => import('./SaveToDraft')));
const Help = withSuspense(lazy(() => import('./Help')));

export {
  Message,
  NoChannel,
  CallChannel,
  EmailChannel,
  AssignLead,
  DeleteRecurrence,
  EmailOptOut,
  EmailSchedule,
  Sales,
  AutomationReport,
  MarkOpen,
  EditTask,
  DateAndTime,
  LeadList,
  GoTo,
  Reload,
  Lead,
  Opportunity,
  Edit,
  Delete,
  CustomActivity,
  Call,
  Share,
  ChangeOwner,
  ChangeStage,
  AddActivity,
  AddOpportunity,
  Converse,
  AddTask,
  Form,
  AddAccountActivity,
  SharedEmail,
  AddNote,
  Mail,
  Add,
  AddToList,
  SaveContact,
  Cancel,
  Done,
  AddLead,
  AddEmptyList,
  ViewConfig,
  Task,
  Mavis,
  LeadIcon,
  Custom,
  Activity,
  Accounts,
  AccountActivity,
  LeftPanelCollapse,
  MoveToLeft,
  AddAccount,
  ArrowDown,
  Close,
  Option,
  AddIcon,
  Sync,
  Time,
  BackAndForward,
  Information,
  DateAndTimeFilled,
  CustomActivityInbound,
  CustomActivityOutbound,
  Email,
  EmailRepliedActivity,
  EmailClicked,
  EmailSent,
  FormSubmitted,
  Activities,
  InboundPhoneCall,
  LeadCaptured,
  NeutralEmail,
  OpenedMail,
  OpportunityCaptured,
  PortalActivity,
  PositiveMail,
  Privacy,
  WebActivity,
  OutboundPhoneCall,
  OpportunityChangeLog,
  RestrictedEye,
  Star,
  Home,
  Copy,
  SaveToDraft,
  Help,
  StatusIcon
};
