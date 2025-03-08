import { lazy } from 'react';

const Default = lazy(() => import('./default'));
const Portal = lazy(() => import('./portal'));
const DeleteLogs = lazy(() => import('./delete-logs'));
const Web = lazy(() => import('./web'));
const Privacy = lazy(() => import('./privacy'));
const Phone = lazy(() => import('./phone'));
const Email = lazy(() => import('./email'));
const LeadCapture = lazy(() => import('./lead-capture'));
const OpportunityActivity = lazy(() => import('./opportunity-activity'));
const OpportunityAudit = lazy(() => import('./opportunity-audit'));
const DynamicFormSubmission = lazy(() => import('./dynamic-form-submission'));
const LeadAudit = lazy(() => import('./lead-audit'));
const Custom = lazy(() => import('./custom'));
const Task = lazy(() => import('./task'));
const Notes = lazy(() => import('./notes'));

export {
  Default,
  Portal,
  DeleteLogs,
  Web,
  Privacy,
  Phone,
  Email,
  LeadCapture,
  OpportunityActivity,
  OpportunityAudit,
  LeadAudit,
  Custom,
  DynamicFormSubmission,
  Task,
  Notes
};
