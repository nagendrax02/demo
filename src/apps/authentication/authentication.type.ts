import { IAuthenticationStatus } from 'common/utils/authentication/authentication.types';

interface IMessageEvent {
  type: string;
  message: unknown;
}

interface IAuthInitializationPayload {
  envConfig: Record<string, unknown>;
}

interface IUseMarvinAuthentication {
  setAuthStatus: (data: IAuthenticationStatus) => void;
  iframeRef: React.MutableRefObject<HTMLIFrameElement | null>;
}

interface IEmailResponse {
  MarvinAppURL: string;
}

interface IAuthData {
  emailResponse?: IEmailResponse;
}

export type {
  IAuthInitializationPayload,
  IAuthData,
  IUseMarvinAuthentication,
  IMessageEvent,
  IEmailResponse
};
