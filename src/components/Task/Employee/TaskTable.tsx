'use client';

import { Task, TaskStatus } from '@/types/task';
import { Employee } from '@/types/employee';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EmployeeTaskTableProps {
  id: string;
  tasks: Task[];
  loading: boolean;
  onEdit: (updatedTask: Task) => Promise<void>;
  onDelete: () => void;
  employees: Employee[];
}

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

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
    return <div className="text-center py-8 text-gray-500">Loading data...</div>;
  }

  return (
    <div className="max-w-3xl p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Task List</h2>
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No tasks available.</div>
      ) : (
        <Table className="border border-gray-200">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-left px-4 py-3 text-gray-700 font-medium">
                Title
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-gray-700 font-medium">
                Due Date
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-gray-700 font-medium">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <TableCell className="px-4 py-3">{task.title}</TableCell>
                <TableCell className="px-4 py-3">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '-'}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Select
                    value={task.status}
                    onValueChange={(value) =>
                      handleStatusChange(task.id, value as TaskStatus)
                    }
                  >
                    <SelectTrigger className="w-[160px] rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
