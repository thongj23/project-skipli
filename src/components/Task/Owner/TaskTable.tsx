import { Button } from '@/components/ui/button';
import type { Task } from '@/types/task';
import type { Employee } from '@/types/employee';

type Props = {
  tasks: Task[];
  employees: Employee[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

export default function TaskTable({ tasks, employees, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-center py-4 text-gray-500">No tasks found.</div>;
  }

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee ? employee.name : 'Unknown';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'None';
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  const formatStatus = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const statusClass = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <table className="w-full text-left border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          {/* <th className="p-3">Task ID</th> */}
          <th className="p-3">Title</th>
          <th className="p-3">Description</th>
          <th className="p-3">Due Date</th>
          <th className="p-3">Employee</th>
          <th className="p-3">Status</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} className="border-t border-gray-200">
            {/* <td className="p-3">{task.id}</td> */}
            <td className="p-3">{task.title}</td>
            <td className="p-3">{task.description || 'None'}</td>
            <td className="p-3">{formatDate(task.dueDate)}</td>
            <td className="p-3">{getEmployeeName(task.employeeId)}</td>
            <td className="p-3">
              <span className={`px-2 py-1 rounded ${statusClass(task.status)}`}>
                {formatStatus(task.status)}
              </span>
            </td>
            <td className="p-3 space-x-2">
              <Button className="bg-blue-500 text-white" onClick={() => onEdit(task)}>
                Edit
              </Button>
              <Button className="bg-red-500 text-white" onClick={() => onDelete(task.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
