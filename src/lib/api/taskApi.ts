import axiosInstance from '@/lib/api/axiosInstance';
import { Task } from '@/types/task';

export const taskService = {
  async getAll(): Promise<Task[]> {
    try {
      const res = await axiosInstance.get('/owner/tasks');
      return res.data.map((task: any) => ({
        taskId: task.taskId,
        employeeId: task.employeeId,
        status: task.status,
      }));
    } catch (error: any) {
      console.error('Lỗi khi lấy danh sách task:', error.message);
      if (error.message.includes('Không tìm thấy token xác thực')) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      throw new Error('Không thể tải danh sách task: ' + error.message);
    }
  },

  async create(data: Omit<Task, 'taskId'>): Promise<Task> {
    try {
      const res = await axiosInstance.post('/owner/tasks', data);
      const task = res.data;
      return {
        taskId: task.taskId,
        employeeId: task.employeeId,
        status: task.status,
      };
    } catch (error: any) {
      console.error('Lỗi khi tạo task:', error.message);
      if (error.message.includes('Không tìm thấy token xác thực')) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      throw new Error('Không thể tạo task: ' + error.message);
    }
  },

  async update(taskId: string, updates: Partial<Task>): Promise<Task> {
    try {
      const res = await axiosInstance.patch('/owner/tasks', { taskId, ...updates });
      const task = res.data;
      return {
        taskId: task.taskId,
        employeeId: task.employeeId,
        status: task.status,
      };
    } catch (error: any) {
      console.error('Lỗi khi cập nhật task:', error.message);
      if (error.message.includes('Không tìm thấy token xác thực')) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      throw new Error('Không thể cập nhật task: ' + error.message);
    }
  },

  async remove(taskId: string): Promise<{ message: string }> {
    try {
      const res = await axiosInstance.delete(`/owner/tasks/${taskId}`);
      return res.data;
    } catch (error: any) {
      console.error('Lỗi khi xóa task:', error.message);
      if (error.message.includes('Không tìm thấy token xác thực')) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      throw new Error('Không thể xóa task: ' + error.message);
    }
  },
};