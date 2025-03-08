import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const TemplateSelectMenu = withSuspense(lazy(() => import('./TemplateSelectMenu')));

export default TemplateSelectMenu;
