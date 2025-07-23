import axiosInstance from '@/lib/api/axiosInstance';
import { Employee } from '@/types/employee';

type FormData = Omit<Employee, 'id' | 'schedule' | 'tasks'>;

export const employeeService = {
async getAll(page = 1, limit = 10) {
  const res = await axiosInstance.get(`/owner/GetAllEmployees?page=${page}&limit=${limit}`);
  const { data, total } = res.data;
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
},

async create(data: FormData): Promise<Employee> {
  const res = await axiosInstance.post('/owner', {
    name: data.name,
    email: data.email
  });
  const emp = res.data;
  return {
    id: emp.employeeId,
    name: emp.name,
    email: emp.email,
    status: emp.status || 'active',
    phoneNumber: emp.phoneNumber || '',
    role: emp.role || 'employee',
    department: emp.department || '',
    schedule: emp.workSchedule || {},
    tasks: emp.tasks || []
  };
},

async update(id: string, updates: Partial<Employee>): Promise<Employee> {
  const updateData = {
    employeeId: id,
    name: updates.name,
    email: updates.email,
    department: updates.department,
    role: updates.role
  };
  const res = await axiosInstance.patch('/owner/UpdateEmployee', updateData);
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
    tasks: emp.tasks || []
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