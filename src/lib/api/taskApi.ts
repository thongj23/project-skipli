import axiosInstance from '@/lib/api/axiosInstance';
import { Task } from '@/types/task';
import { Socket } from 'socket.io-client';

export const taskService = (socket: Socket | null) => ({
async getAll(page = 1, limit = 10): Promise<Task[]> {
  try {
    const res = await axiosInstance.get('/owner/tasks', {
      params: { page, limit },
    });

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
    console.error('Failed to fetch task list:', error.message);

    if (error.message.includes('Authentication token not found')) {
      throw new Error('Session has expired. Please log in again.');
    }

    throw new Error('Unable to load tasks: ' + error.message);
  }
},


  async create(data: Omit<Task, 'id'>): Promise<Task> {
    try {
      const res = await axiosInstance.post('/owner/tasks', data);
      const task: Task = res.data;

      if (socket?.connected) {
        socket.emit('taskCreated', task);
      }

      return task;
    } catch (error: any) {
      console.error('Failed to create task:', error.message);
      if (error.message.includes('Authentication token not found')) {
        throw new Error('Session has expired. Please log in again.');
      }
      throw new Error('Unable to create task: ' + error.message);
    }
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      const res = await axiosInstance.patch('/owner/task', { id, ...updates });
      const task: Task = res.data;

      if (socket?.connected) {
        socket.emit('taskUpdated', task);
      }

      return task;
    } catch (error: any) {
      console.error('Failed to update task:', error?.response?.data || error.message);
      if (error?.response?.status === 401 || error.message.includes('token')) {
        throw new Error('Session has expired. Please log in again.');
      }
      throw new Error('Unable to update task: ' + (error?.response?.data?.message || error.message));
    }
  },

  async remove(id: string): Promise<{ message: string }> {
    try {
      const res = await axiosInstance.delete(`/owner/task/${id}`);
      if (socket?.connected) {
        socket.emit('taskDeleted', id);
      }
      return res.data;
    } catch (error: any) {
      console.error('Failed to delete task:', error.message);
      if (error.message.includes('Authentication token not found')) {
        throw new Error('Session has expired. Please log in again.');
      }
      throw new Error('Unable to delete task: ' + error.message);
    }
  },

async getByUserId(userId: string, page: number, limit: number): Promise<{ tasks: Task[]; total: number }> {
  try {
    const res = await axiosInstance.get(`/task/user/${userId}`, {
      params: { page, limit }
    });
    const tasks = res.data.tasks.map((task: any) => ({
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

    const total = res.data.total;

    return { tasks, total };
  } catch (error: any) {
    console.error('Failed to fetch user tasks:', error.message);
    if (error.message.includes('Authentication token not found')) {
      throw new Error('Session has expired. Please log in again.');
    }
    throw new Error('Unable to load tasks: ' + error.message);
  }
},


  async updateStatus(taskId: string, status: Task['status']): Promise<Task> {
    try {
      const res = await axiosInstance.patch(`/task`, { id: taskId, status });
      const updatedTask: Task = res.data;

      if (socket?.connected) {
        socket.emit('taskUpdated', updatedTask);
      }

      return updatedTask;
    } catch (error: any) {
      console.error('Failed to update task status:', error?.response?.data || error.message);
      if (error?.response?.status === 401 || error.message.includes('token')) {
        throw new Error('Session has expired. Please log in again.');
      }
      throw new Error('Unable to update task status: ' + (error?.response?.data?.message || error.message));
    }
  },
});
