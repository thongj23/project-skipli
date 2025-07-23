'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { taskService } from '@/lib/api/taskApi';
import TaskTable from './TaskTable';
import Pagination from '../../ui/Pagination';
import type { Task } from '@/types/task';
import { useUserStore } from '@/stores/userStore';

export default function EmployeeTaskManagement() {
  const user = useUserStore((state) => state.user);
  const employeeId = user?.id;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    if (!user?.id) return;

    const socketInstance = io('http://localhost:3003', {
      query: { employeeId: user.id },
    });
    console.log('🔌 Attempting to connect socket with employeeId:', user.id)
    setSocket(socketInstance);

  socketInstance.on('connect', () => {
    console.log('✅ Socket connected with ID:', socketInstance.id);
  });
    socketInstance.on('taskUpdated', (updatedTask: Task) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    });
    socketInstance.on('taskCreated', (newTask: Task) => {
      if (newTask.employeeId === user.id) {
        setTasks((prev) => [...prev, newTask]);
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    if (!employeeId || !socket) return;

    const fetchEmployeeTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const taskApi = taskService(socket);
        const { tasks, total } = await taskApi.getByUserId(employeeId, page, limit);
        setTasks(tasks);
        setTotal(total);
      } catch (err: any) {
        console.error('Không thể tải tasks:', err);
        setError(err.message || 'Lỗi khi tải công việc');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeTasks();
  }, [employeeId, socket, page]);

  const handleEdit = async (updatedTask: Task) => {
    if (!socket) {
      setError('Socket chưa kết nối');
      return;
    }
    try {
      const taskApi = taskService(socket);
      await taskApi.updateStatus(updatedTask.id, updatedTask.status);
    } catch (err: any) {
      console.error('Không thể cập nhật task:', err);
      setError(err.message || 'Lỗi khi cập nhật công việc');
    }
  };

  if (!employeeId) {
    return <div>Không tìm thấy thông tin người dùng</div>;
  }

  return (
    <div className="p-6">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <h2 className="text-xl font-semibold mb-4">My Task</h2>
      <TaskTable
        id={employeeId}
        tasks={tasks}
        employees={[]}
        loading={loading}
        onEdit={handleEdit}
        onDelete={() => {}}
      />

      
        <div className="mt-4 flex justify-end">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    </div>
  );
}
