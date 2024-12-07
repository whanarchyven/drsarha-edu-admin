export type Error = {
  message: string;
  code: number;
  customData: any;
};

export type TRequestStatuses = 'init' | 'pending' | 'fulfilled' | 'rejected';

export interface IResponse<D = any> {
  status: 'success' | 'error';
  data: D;
  errors: Error[];
}

export const API = {
  getTestApiEndpoint: `/endpoint/name`,
  getTestApiEndpointById: (id: string) => `/endpoint/name/${id}`,
};
