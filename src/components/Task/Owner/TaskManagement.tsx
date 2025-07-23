'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { taskService } from '@/lib/api/taskApi';
import { employeeService } from '@/lib/api/employeeApi';
import TaskTable from './TaskTable';
import ModalTaskForm from './ModalTaskForm';
import Pagination from '../../ui/Pagination';
import type { Task, FormData } from '@/types/task';
import type { Employee } from '@/types/employee';
import { useUserStore } from '@/stores/userStore';

export default function TaskManagement() {
  const user = useUserStore((state) => state.user);
  const employeeId = user?.uid;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!employeeId) {
      setError('User information not found');
      return;
    }

    const socketInstance = io('http://localhost:3003', {
      query: { employeeId },
    });

    setSocket(socketInstance);

    socketInstance.on('taskCreated', (newTask: Task) => {
      setTasks((prev) => [...prev, newTask]);
    });

    socketInstance.on('taskUpdated', (updatedTask: Task) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task))
      );
    });

    socketInstance.on('taskDeleted', (taskId: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [employeeId]);

  useEffect(() => {
    if (socket) {
      fetchTasksAndEmployees();
    }
  }, [socket]);

  useEffect(() => {
    setTotalPages(Math.ceil(tasks.length / limit));
  }, [tasks, limit]);

  const fetchTasksAndEmployees = async () => {
    try {
      setLoading(true);
      const taskApi = taskService(socket);
      const [taskResponse, employeeResponse] = await Promise.all([
        taskApi.getAll(), 
        employeeService.getAll(),
      ]);

      setTasks(taskResponse);
      setEmployees(employeeResponse.data);
    } catch (err: any) {
      setError(err.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

const handleSave = async (data: FormData, taskId?: string) => {
  try {
    const taskApi = taskService(socket);

    if (taskId && selectedTask) {
      const updates: Partial<Task> = {};
      if (data.employeeId !== selectedTask.employeeId) {
        updates.employeeId = data.employeeId;
      }
      if (data.status !== selectedTask.status) {
        updates.status = data.status;
      }
      if (Object.keys(updates).length > 0) {
        await taskApi.update(taskId, updates);
      
      }
    } else {
      await taskApi.create(data);
    
    }

    setOpenForm(false);
    setSelectedTask(null);
  } catch (err: any) {
    setError(err.message || 'Error saving task');
  }
};


  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setOpenForm(true);
  };

const handleDelete = async (taskId: string) => {
  try {
    const taskApi = taskService(socket);
    await taskApi.remove(taskId);
 await fetchTasksAndEmployees(); 
  } catch (err: any) {
    setError(err.message || 'Error deleting task');
  }
};


  return (
    <div className="p-6">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Task Management</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setSelectedTask(null);
            setOpenForm(true);
          }}
        >
          Add Task
        </button>
      </div>

      <TaskTable
        tasks={tasks.slice((page - 1) * limit, page * limit)}  
        employees={employees}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      
        <div className="mt-4 flex justify-end">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      

      <ModalTaskForm
        key={selectedTask?.id || 'new'}
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedTask(null);
        }}
        onSave={handleSave}
        employees={employees}
        defaultValues={selectedTask || undefined}
      />
    </div>
  );
}
