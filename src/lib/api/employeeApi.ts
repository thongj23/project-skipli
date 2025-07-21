import axiosInstance from '@/lib/api/axiosInstance';
import { Employee } from '@/types/employee';

type FormData = Omit<Employee, 'id' | 'schedule' | 'tasks'>;

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    const res = await axiosInstance.get('/owner/GetAllEmployees');
    return res.data.map((emp: any) => ({
      id: emp.employeeId,
      name: emp.name,
      email: emp.email,
      phoneNumber: emp.phoneNumber || '', 
      role: emp.role,
      department: emp.department || '',
      schedule: emp.workSchedule || {},
      tasks: emp.tasks || [],
    }));
  },

  async getById(id: string): Promise<Employee> {
    const res = await axiosInstance.get('/owner/GetEmployee', {
      params: { id },
    });
    const emp = res.data;
    return {
      id: emp.employeeId,
      name: emp.name,
      email: emp.email,
      status: emp.status,
      phoneNumber: emp.phoneNumber || '',
      role: emp.role,
      department: emp.department || '',
      schedule: emp.workSchedule || {},
      tasks: emp.tasks || [],
    };
  },

  async create(data: FormData): Promise<Employee> {
    const res = await axiosInstance.post('/owner', data);
    const emp = res.data;
    return {
      id: emp.employeeId,
      name: emp.name,
      email: emp.email,
      status: emp.status,
      phoneNumber: emp.phoneNumber || '',
      role: emp.role,
      department: emp.department || '',
      schedule: emp.workSchedule || {},
      tasks: emp.tasks || [],
    };
  },

  async update(id: string, updates: Partial<Employee>): Promise<Employee> {
    console.log('📦 Payload gửi lên:', {
      employeeId: id,
      ...updates,
    });
    const res = await axiosInstance.patch('/owner/UpdateEmployee', {
      employeeId: id,
      ...updates,
    });
    const emp = res.data;
    return {
      id: emp.employeeId,
      name: emp.name,
      email: emp.email,
      phoneNumber: emp.phoneNumber || '',
      status: emp.status,
      role: emp.role,
      department: emp.department || '',
      schedule: emp.workSchedule || {},
      tasks: emp.tasks || [],
    };
  },

  async remove(id: string): Promise<{ message: string }> {
    const res = await axiosInstance.post('/owner/DeleteEmployee', { employeeId: id });
    return res.data;
  },

  async setSchedule(id: string, schedule: { days: string[]; hours: string }) {
    const res = await axiosInstance.post('/owner/SetSchedule', { id, schedule });
    return res.data;
  },
};