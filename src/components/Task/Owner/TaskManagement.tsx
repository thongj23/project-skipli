'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { taskService } from '@/lib/api/taskApi';
import { employeeService } from '@/lib/api/employeeApi';
import TaskTable from './TaskTable';
import ModalTaskForm from './ModalTaskForm';
import type { Task } from '@/types/task';
import type { Employee } from '@/types/employee';

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchTasksAndEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const [taskData, employeeData] = await Promise.all([
        taskService.getAll(),
        employeeService.getAll(),
      ]);
      setTasks(taskData);
      setEmployees(employeeData);
    } catch (error: any) {
      console.error('Không thể tải dữ liệu:', error);
      setError(error.message);
      if (error.message.includes('Vui lòng đăng nhập lại')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Omit<Task, 'taskId'>, taskId?: string) => {
    try {
      setError(null);
      if (taskId && selectedTask) {
        const updates: Partial<Task> = {};
        if (data.employeeId !== selectedTask.employeeId && data.employeeId) updates.employeeId = data.employeeId;
        if (data.status !== selectedTask.status) updates.status = data.status;

        if (Object.keys(updates).length > 0) {
          await taskService.update(taskId, updates);
          console.log('Cập nhật task thành công:', updates);
        } else {
          console.log('Không có thay đổi nào được phát hiện, bỏ qua cập nhật.');
        }
      } else {
        await taskService.create(data);
       
      }
      await fetchTasksAndEmployees();
      setOpenForm(false);
      setSelectedTask(null);
    } catch (error: any) {
      console.error('Lỗi khi lưu task:', error);
      setError(error.message);
      if (error.message.includes('Vui lòng đăng nhập lại')) {
        router.push('/login');
      }
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setOpenForm(true);
  };

  const handleDelete = async (taskId: string) => {
    try {
      setError(null);
      await taskService.remove(taskId);
      await fetchTasksAndEmployees();
    } catch (error: any) {
      console.error('Lỗi khi xóa task:', error);
      setError(error.message);
      if (error.message.includes('Vui lòng đăng nhập lại')) {
        router.push('/login');
      }
    }
  };
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  return (
    <div className="p-6">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý Task</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setSelectedTask(null);
            setOpenForm(true);
          }}
        >
          + Thêm Task
        </button>
      </div>

      <TaskTable
        tasks={tasks}
        employees={employees}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ModalTaskForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedTask(null);
        }}
        onSave={handleSave}
        employees={employees}
        defaultValues={selectedTask || undefined}
        initialData={
          selectedTask
            ? {
                employeeId: selectedTask.employeeId,
                status: selectedTask.status,
              }
            : null
        }
      />
    </div>
  );
}