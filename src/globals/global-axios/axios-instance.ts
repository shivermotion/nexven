import axios from 'axios';
import { IResponse, getInterface, postInterface } from './axios-interfaces';

const instance = axios.create({
  baseURL: 'https://your-api-base-url.com/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const api = {
  get: async (props: getInterface): Promise<IResponse> => {
    try {
      const response = await instance.get(props.url);
      return { type: 'success', data: response.data, status: response.status };
    } catch (error: any) {
      return {
        type: 'error',
        message: error?.response?.data?.message || error.message,
        status: error?.response?.status,
        data: error?.response?.data,
      };
    }
  },
  post: async (props: postInterface): Promise<IResponse> => {
    try {
      const response = await instance.post(props.url, props.data);
      return { type: 'success', data: response.data, status: response.status };
    } catch (error: any) {
      return {
        type: 'error',
        message: error?.response?.data?.message || error.message,
        status: error?.response?.status,
        data: error?.response?.data,
      };
    }
  },
}; 