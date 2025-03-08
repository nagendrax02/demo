import { LogType } from './logger.types';

export const OS_CLIENT = [
  { os: 'Windows 10', regex: /(Windows 10.0|Windows NT 10.0)/ },
  { os: 'Windows 8.1', regex: /(Windows 8.1|Windows NT 6.3)/ },
  { os: 'Windows 8', regex: /(Windows 8|Windows NT 6.2)/ },
  { os: 'Windows 7', regex: /(Windows 7|Windows NT 6.1)/ },
  { os: 'Windows Vista', regex: /Windows NT 6.0/ },
  { os: 'Windows Server 2003', regex: /Windows NT 5.2/ },
  { os: 'Windows XP', regex: /(Windows NT 5.1|Windows XP)/ },
  { os: 'Windows 2000', regex: /(Windows NT 5.0|Windows 2000)/ },
  { os: 'Windows ME', regex: /(Win 9x 4.90|Windows ME)/ },
  { os: 'Windows 98', regex: /(Windows 98|Win98)/ },
  { os: 'Windows 95', regex: /(Windows 95|Win95|Windows_95)/ },
  { os: 'Windows NT 4.0', regex: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
  { os: 'Windows CE', regex: /Windows CE/ },
  { os: 'Windows 3.11', regex: /Win16/ },
  { os: 'Android', regex: /Android/ },
  { os: 'Sun OS', regex: /SunOS/ },
  { os: 'Chrome OS', regex: /CrOS/ },
  { os: 'Linux', regex: /(Linux|X11(?!.*CrOS))/ },
  { os: 'iOS', regex: /(iPhone|iPad|iPod)/ },
  { os: 'Mac OS X', regex: /Mac OS X/ },
  { os: 'Mac OS', regex: /(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
  { os: 'UNIX', regex: /UNIX/ }
];

export const BROWSER = [
  { regex: /edg/i, offset: 4, browser: 'Edge', condition: true },
  { regex: /firefox|fxios/i, offset: 8, browser: 'Firefox', condition: true },
  { regex: /opr\//i, offset: 6, browser: 'Opera', condition: true },
  { regex: /chrome/i, offset: 7, browser: 'Chrome', condition: true },
  //@ts-ignore: Safari has window?.safari object
  { regex: /safari/i, offset: 7, browser: 'Safari', condition: !!window?.safari }
];

export const HEADER = {
  authorization: 'Authorization',
  contentType: 'Content-Type'
};

export const API_PATH = {
  [LogType.Fatal]: '/Fatal',
  [LogType.Experience]: '/Experience'
};

export const ERROR_MSG = {
  module: 'ModuleName can not be empty and should be a string',
  message: 'Message can not be empty and should be a string',
  data: 'Data can not be empty and should be a an object',
  error: 'Error can not be empty',
  method: 'Method can not be empty and should be a string'
};

export const STORAGE_KEY = '__logger-config__';

export const BATCH_SIZE = 10;
