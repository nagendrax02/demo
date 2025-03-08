type CampaignAttachments = Record<string, string>[];

interface IEmailResponse {
  Id: string;
  FromUser: string;
  FromUserName: string;
  CampaignActivityId: string;
  To: string;
  Subject: string;
  SubjectTracking: string;
  ContentHtml: string;
  ContentHtmlTracking: string;
  ContentHtmlRaw: string;
  ContentText: string;
  StartDate: string;
  EndDate: string;
  MailMergeData: string;
  CreatedBy: string;
  CreatedOn: string;
  ModifiedBy: string;
  ModifiedOn: string;
  OwnerId: string;
  EmailCategoryName: string;
  CampaignAttachments?: CampaignAttachments | undefined;
}

interface ICcBccOption {
  Name?: string;
  Email?: string;
}

interface ICcBccData {
  Cc?: {
    Leads?: (ICcBccOption | undefined)[];
    Users?: (ICcBccOption | undefined)[];
  };
  Bcc?: {
    Leads?: (ICcBccOption | undefined)[];
    Users?: (ICcBccOption | undefined)[];
  };
}

interface IReplyToData {
  name: string;
  email: string;
}

interface IAugmentedEmailData {
  subject: string | undefined;
  body: string;
  category: string;
  ccBccData: ICcBccData;
  campaignAttachments: CampaignAttachments;
  fromUsername: string;
  fromUserId: string;
  replyTo: IReplyToData;
}

interface IAugmentedEmailPreviewData {
  augmentEmailData: IAugmentedEmailData;
  isLoading: boolean;
}

export type {
  IEmailResponse,
  ICcBccData,
  ICcBccOption,
  CampaignAttachments,
  IReplyToData,
  IAugmentedEmailPreviewData,
  IAugmentedEmailData
};
