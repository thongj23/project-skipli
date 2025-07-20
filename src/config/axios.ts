import axios, { AxiosError, AxiosInstance } from 'axios';


const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    let errorMessage = 'An error occurred. Please try again.';

    if (error.response) {
      const data = error.response.data as { error?: string };
      errorMessage = data?.error || errorMessage;
    } else if (error.request) {
      errorMessage = 'Unable to connect to the server. Please check your network connection.';
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
