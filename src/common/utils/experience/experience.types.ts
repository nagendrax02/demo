interface IExperienceConfig {
  eventStartTime: number;
  experience: string;
  experienceId: string;
  hasException?: boolean;
}
interface IExperience {
  [key: string]: IExperienceConfig;
}

interface IExperienceEvent {
  [key: string]: {
    eventStartTime: number;
  };
}

interface IUseExperience {
  experiences: IExperience;
  experienceEvents: IExperienceEvent;
  experienceId: Record<string, string>;
}

interface IRelatedExperience {
  module: string;
  experience: string;
  key: string;
}
interface IStartExperience {
  module: string;
  experience: string;
  key: string;
  startTime?: number;
  logInitialLoadTime?: boolean;
  relatedExperience?: IRelatedExperience;
}

interface IEndExperience {
  module: string;
  experience: string;
  key: string;
  startTime?: number;
  logServerResponseTime?: boolean;
  relatedExperience?: IRelatedExperience;
  additionalData?: Record<string, unknown>;
}

interface IExperienceLog {
  module: string;
  experience: string;
  event: string;
  experienceId: string;
  eventStartTime: number;
  eventEndTime: number;
  isExperience: number;
  hasError: number;
}

interface IConnection {
  type: string;
  effectiveType: string;
  downlink: string;
  downlinkMax: number;
  rtt: string;
  hardwareConcurrency: string;
}

interface ILogExperience {
  actionName: string;
  log: IExperienceLog;
  type: string;
}

interface IStartEvent {
  module: string;
  experience: string;
  event: string;
  key: string;
  relatedExperience?: IRelatedExperience;
}

interface ILogInitialLoadTime {
  endTime: number;
}

interface IEndEvent {
  module: string;
  experience: string;
  event: string;
  key: string;
  hasException?: boolean;
  logInitialLoadTime?: ILogInitialLoadTime;
  relatedExperience?: IRelatedExperience;
}

interface IGetExpConfig {
  module: string;
  experience: string;
  key: string;
  relatedExperience?: IRelatedExperience;
}

interface ISingleEventLog {
  module: string;
  experience: string;
  event: string;
  experienceId: string;
  isExperience: number;
  hasError: number;
  [data: string]: string | number | undefined;
  eventStartTime?: number;
  eventEndTime?: number;
}

interface ILogSingleEvent {
  actionName: string;
  type: string;
  log: ISingleEventLog;
}

interface IGetExperienceKey {
  module: string;
  key: string;
}

export type {
  IExperienceConfig,
  IUseExperience,
  IStartExperience,
  IEndExperience,
  IExperienceLog,
  IConnection,
  ILogExperience,
  IStartEvent,
  IEndEvent,
  ILogSingleEvent,
  IGetExperienceKey,
  ILogInitialLoadTime,
  IGetExpConfig,
  IRelatedExperience
};
