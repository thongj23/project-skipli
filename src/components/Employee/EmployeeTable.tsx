import { Button } from '@/components/ui/button';
import type { Employee } from '@/types/employee';

type Props = {
  employees: Employee[];
  loading: boolean;
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
};

export default function EmployeeTable({ employees, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (employees.length === 0) {
    return <div className="text-center py-4 text-gray-500">No employees found.</div>;
  }

  const getStatus = (emp: Employee): 'Active' | 'Inactive' => {
    return emp.schedule ? 'Active' : 'Inactive';
  };

  return (
    <table className="w-full text-left border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">Employee Name</th>
          <th className="p-3">Email</th>
          <th className="p-3">Status</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => {
          const status = getStatus(emp);
          return (
            <tr key={emp.id} className="border-t border-gray-200">
              <td className="p-3">{emp.name}</td>
              <td className="p-3">{emp.email}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded ${
                    status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {status}
                </span>
              </td>
              <td className="p-3 space-x-2">
                <Button className="bg-blue-500 text-white" onClick={() => onEdit(emp)}>
                  Edit
                </Button>
                <Button className="bg-red-500 text-white" onClick={() => onDelete(emp.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
