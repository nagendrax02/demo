interface IDeleteResponse {
  IsSuccess?: boolean;
  Message?:
    | string
    | {
        IsSuccessful: boolean;
      };
  Id: string;
}

export type { IDeleteResponse };
