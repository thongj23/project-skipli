'use client';

import { Task, TaskStatus } from '@/types/task';
import { Employee } from '@/types/employee';

interface EmployeeTaskTableProps {
  id: string;
  tasks: Task[];
  loading: boolean;
  onEdit: (updatedTask: Task) => Promise<void>;
  onDelete: () => void;
  employees: Employee[];
}

export default function TaskTable({
  id,
  tasks,
  loading,
  onEdit,
  onDelete,
  employees,
}: EmployeeTaskTableProps) {
  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await onEdit({ id: taskId, status } as Task);
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '6px', maxWidth: 600 }}>
      <h2 style={{ marginBottom: '1rem' }}>Task List</h2>
      {tasks.length === 0 ? (
        <div>No tasks available.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Title</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Status</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{task.title}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
