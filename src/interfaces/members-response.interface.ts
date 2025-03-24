export interface IMembersResponse {
  status: RequestStatusTypesEnum;
  data: IMembersResponseData[];
}

export interface IMembersResponseData {
  team_id: number;
  team_name: string;
}

export enum RequestStatusTypesEnum {
  SUCCESS = 'success',
  ERROR = 'error',
}
