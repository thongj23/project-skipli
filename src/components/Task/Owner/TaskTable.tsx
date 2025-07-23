import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
    return <div className="text-center py-4 text-muted-foreground">No tasks found.</div>;
  }

const getEmployeeName = (employeeId: string) => {
  const employee = employees.find((emp) => emp.employeeId === employeeId);
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
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Employee</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.description || 'None'}</TableCell>
            <TableCell>{formatDate(task.dueDate)}</TableCell>
            <TableCell>{getEmployeeName(task.employeeId)}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${statusClass(task.status)}`}
              >
                {formatStatus(task.status)}
              </span>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" onClick={() => onEdit(task)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => onDelete(task.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
