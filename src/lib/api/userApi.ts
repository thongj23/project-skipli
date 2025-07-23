import axios from 'axios';
import axiosInstance from '@/lib/api/axiosInstance';
export const userService = {
  async getAllUser() {
    const res = await axiosInstance.get('/user/getAllUser');
    return res.data;
  },
};
