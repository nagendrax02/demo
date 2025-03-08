import { getApiUrl } from 'common/utils/helpers';
import { portalLinkTypeMap } from './constants';
import { PortalLinkTypes } from './portal-link.types';
import commonStyle from '../common-style.module.css';
import { classNames } from 'common/utils/helpers/helpers';

export interface IPortalLink {
  displayName: string;
  id: string;
  linkType: PortalLinkTypes;
}

const PortalLink = (props: IPortalLink): JSX.Element => {
  const { displayName, id, linkType } = props;

  const getUrl = (): string => {
    const baseUrl = getApiUrl('PLATFORM_APP_BASE_URL');
    return `${baseUrl}${portalLinkTypeMap?.[linkType]}${id}`;
  };

  const getDisplayName = (): string => {
    const defaultName = PortalLinkTypes?.FormName ? 'Form' : 'Portal';

    return displayName || defaultName;
  };

  return (
    <a className={classNames(commonStyle.ellipsis, commonStyle.hyper_link)} href={getUrl()}>
      {getDisplayName()}
    </a>
  );
};

export default PortalLink;
