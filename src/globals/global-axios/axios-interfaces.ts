export interface IResponse {
  type: 'success' | 'error';
  data?: any;
  status?: number;
  message?: string;
}

export interface getInterface {
  url: string;
  from?: string;
  track?: number;
  log?: boolean;
}

export interface postInterface {
  url: string;
  data: any;
  from?: string;
  track?: number;
  log?: boolean;
} 