import { CallerSource } from 'src/common/utils/rest-client';

interface IUserName {
  id: string;
  callerSource: CallerSource;
  name?: string;
}

interface IUserNameMap {
  [id: string]: string;
}
export type { IUserName, IUserNameMap };
