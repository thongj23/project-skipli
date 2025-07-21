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
    return <div className="text-center py-4">Đang tải...</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-center py-4 text-gray-500">Không tìm thấy task.</div>;
  }

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee ? employee.name : 'Không xác định';
  };

  return (
    <table className="w-full text-left border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">Mã Task</th>
          <th className="p-3">Nhân viên</th>
          <th className="p-3">Trạng thái</th>
          <th className="p-3">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.taskId} className="border-t border-gray-200">
            <td className="p-3">{task.taskId}</td>
            <td className="p-3">{getEmployeeName(task.employeeId)}</td>
            <td className="p-3">
              <span
                className={`px-2 py-1 rounded ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {task.status === 'completed' ? 'Hoàn thành' : 'Đang chờ'}
              </span>
            </td>
            <td className="p-3 space-x-2">
              <Button className="bg-blue-500 text-white" onClick={() => onEdit(task)}>
                Sửa
              </Button>
              <Button className="bg-red-500 text-white" onClick={() => onDelete(task.taskId)}>
                Xóa
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}