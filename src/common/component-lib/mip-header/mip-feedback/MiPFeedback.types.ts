interface IReason {
  id: number;
  title: string;
  value: string;
  hideWorkArea?: undefined;
  unSupportedAction?: string[];
}

interface IFeedbackConfig {
  reason: IReason[];
  workArea: IReason[];
}

enum InputId {
  FeedbackDescription = 'feedback-description'
}

enum FeedbackError {
  NA = 'NA',
  Reason = 'reason',
  WorkArea = 'work-area',
  FeedBackDesc = 'feedback-desc'
}

interface IOnSubmitConfig {
  module: string;
  reason: string;
  workArea: string;
  feedbackDescription: string;
}
type IOnSubmit = (data?: IOnSubmitConfig) => void;

export { FeedbackError, InputId };
export type { IFeedbackConfig, IReason, IOnSubmit, IOnSubmitConfig };
