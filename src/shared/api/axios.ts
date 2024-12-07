import axios, { InternalAxiosRequestConfig } from 'axios';
import { baseAxiosHeaders } from './prepareHeaders';

const API_URL = process.env.NEXT_PUBLIC_FRONT_API_URL;
const CONTENT_PROXY_API_URL =
  process.env.NEXT_PUBLIC_FRONT_CONTENT_PROXY_API_URL;

export const axiosInstance = axios.create({
  headers: baseAxiosHeaders,
  withCredentials: true,
  baseURL:
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_FRONT_API_URL // Полный URL для сервера
      : '/api/proxy', // Прокси для клиента
});

export const axiosContent = axios.create({
  headers: baseAxiosHeaders,
  withCredentials: true,
  baseURL: typeof window === 'undefined' ? API_URL : CONTENT_PROXY_API_URL,
});

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  // const token =
  //   typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // if (token) {
  //   config.headers['Authorization-Token'] = token;
  // }

  return config;
};

axiosInstance.interceptors.request.use(authRequestInterceptor);
axiosContent.interceptors.request.use(authRequestInterceptor);

// Интерцептор для логирования запросов
// axiosInstance.interceptors.request.use((config) => {
//   console.log("Отправка запроса:", {
//     method: config.method,
//     url: config.url,
//     headers: config.headers,
//     data: config.data,
//   });
//   return config;
// });
//
// // Интерцептор для логирования ответов
// axiosInstance.interceptors.response.use(
//     (response) => {
//       console.log("Получен ответ:", {
//         url: response.config.url,
//         status: response.status,
//         data: response.data,
//       });
//       return response;
//     },
//     (error) => {
//       console.error("Ошибка при запросе:", {
//         url: error.config?.url,
//         status: error.response?.status,
//         data: error.response?.data,
//       });
//       return Promise.reject(error);
//     }
// );
