import axiosInstance from '@/lib/api/axiosInstance';
import { Employee } from '@/types/employee';

type FormData = Omit<Employee, 'id' | 'schedule'>;

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    const res = await axiosInstance.get('/owner/GetAllEmployees');
    return res.data;
  },

  async getById(id: string): Promise<Employee> {
    const res = await axiosInstance.get('/owner/GetEmployee', {
      params: { id },
    });
    return res.data;
  },

  async create(data: FormData): Promise<Employee> {
    const res = await axiosInstance.post('/owner', data);
    return res.data;
  },

  async update(id: string, data: FormData): Promise<Employee> {
    const res = await axiosInstance.post('/owner/UpdateEmployee', {
      id,
      ...data,
    });
    return res.data;
  },

  async remove(id: string): Promise<{ message: string }> {
    const res = await axiosInstance.post('/owner/DeleteEmployee', { id });
    return res.data;
  },

  async setSchedule(id: string, schedule: { days: string[]; hours: string }) {
    const res = await axiosInstance.post('/owner/SetSchedule', { id, schedule });
    return res.data;
  },
};
