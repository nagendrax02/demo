import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Edit = withSuspense(lazy(() => import('./Edit')));
const Delete = withSuspense(lazy(() => import('./Delete')));
const CustomAction = withSuspense(lazy(() => import('./CustomAction')));
const Call = withSuspense(lazy(() => import('./Call')));
const Share = withSuspense(lazy(() => import('./Share')));
const ChangeOwner = withSuspense(lazy(() => import('./ChangeOwner')));
const ChangeStage = withSuspense(lazy(() => import('./ChangeStage')));
const AddSalesActivity = withSuspense(lazy(() => import('./AddSalesActivity')));
const AddOpportunity = withSuspense(lazy(() => import('./AddOpportunity')));
const AddTask = withSuspense(lazy(() => import('./AddTask')));
const OptOut = withSuspense(lazy(() => import('./OptOut')));
const AddActivity = withSuspense(lazy(() => import('./AddActivity')));
const FormIcon = withSuspense(lazy(() => import('./FormIcon')));
const EditTask = withSuspense(lazy(() => import('./EditTask')));
const DeleteRecurrence = withSuspense(lazy(() => import('./DeleteRecurrence')));
const ManageColumn = withSuspense(lazy(() => import('./ManageColumn')));

export {
  Edit,
  Delete,
  CustomAction,
  Call,
  Share,
  ChangeOwner,
  ChangeStage,
  AddActivity,
  AddOpportunity,
  AddSalesActivity,
  AddTask,
  OptOut,
  FormIcon,
  EditTask,
  DeleteRecurrence,
  ManageColumn
};
