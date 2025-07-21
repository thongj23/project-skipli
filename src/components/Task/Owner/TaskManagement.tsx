'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { taskService } from '@/lib/api/taskApi';
import { employeeService } from '@/lib/api/employeeApi';
import TaskTable from './TaskTable';
import ModalTaskForm from './ModalTaskForm';
import type { Task, FormData } from '@/types/task';
import type { Employee } from '@/types/employee';

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  useEffect(() => {
    const socketInstance = io('http://localhost:3004');
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socketInstance.on('taskCreated', (newTask: Task) => {
      setTasks((prev) => [...prev, newTask]);
    });

    socketInstance.on('taskUpdated', (updatedTask: Task) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    });

    socketInstance.on('taskDeleted', (taskId: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchTasksAndEmployees();
  }, []);

  const fetchTasksAndEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const taskApi = taskService(socket);
      const [taskData, employeeData] = await Promise.all([
        taskApi.getAll(),
        employeeService.getAll(),
      ]);
      setTasks(taskData);
      setEmployees(employeeData);
    } catch (err: any) {
      console.error('Failed to load data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: FormData, taskId?: string) => {
    try {
      setError(null);
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
          console.log('Task updated successfully');
        } else {
          console.log('No changes detected, skipping update.');
        }
      } else {
        await taskApi.create(data);
        console.log('Task created successfully');
      }

      setOpenForm(false);
      setSelectedTask(null);
    } catch (err: any) {
      console.error('Error while saving task:', err);
      setError(err.message);
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setOpenForm(true);
  };

  const handleDelete = async (taskId: string) => {
    try {
      setError(null);
      const taskApi = taskService(socket);
      await taskApi.remove(taskId);
    } catch (err: any) {
      console.error('Error while deleting task:', err);
      setError(err.message);
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
          + Add Task
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
