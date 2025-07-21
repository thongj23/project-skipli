import axiosInstance from '@/lib/api/axiosInstance';
import { Task } from '@/types/task';
import { Socket } from 'socket.io-client';

export const taskService = (socket: Socket | null) => ({
  async getAll(): Promise<Task[]> {
    try {
      const res = await axiosInstance.get('/owner/tasks');
      return res.data.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
        employeeId: task.employeeId,
        createdBy: task.createdBy,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      }));
    } catch (error: any) {
      console.error('Lỗi khi lấy danh sách task:', error.message);
      if (error.message.includes('Không tìm thấy token xác thực')) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      throw new Error('Không thể tải danh sách task: ' + error.message);
    }
  },

  async create(data: Omit<Task, 'id'>): Promise<Task> {
    try {
      const res = await axiosInstance.post('/owner/tasks', data);
      const task: Task = res.data;

      if (socket && socket.connected) {
        socket.emit('taskCreated', task);
      }

      return task;
    } catch (error: any) {
      console.error('Lỗi khi tạo task:', error.message);
      if (error.message.includes('Không tìm thấy token xác thực')) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      throw new Error('Không thể tạo task: ' + error.message);
    }
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      const res = await axiosInstance.patch('/owner/tasks', { id, ...updates });
      const task: Task = res.data;

      if (socket && socket.connected) {
        socket.emit('taskUpdated', task);
      }

      return task;
    } catch (error: any) {
      console.error('Lỗi khi cập nhật task:', error?.response?.data || error.message);
      if (error?.response?.status === 401 || error.message.includes('token')) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      throw new Error('Không thể cập nhật task: ' + (error?.response?.data?.message || error.message));
    }
  },

  async remove(id: string): Promise<{ message: string }> {
    try {
      const res = await axiosInstance.delete(`/owner/tasks/${id}`);
      if (socket && socket.connected) {
        socket.emit('taskDeleted', id);
      }
      return res.data;
    } catch (error: any) {
      console.error('Lỗi khi xóa task:', error.message);
      if (error.message.includes('Không tìm thấy token xác thực')) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      throw new Error('Không thể xóa task: ' + error.message);
    }
  },
});
