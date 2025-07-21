'use client';

import { useEffect, useState } from 'react';
import { employeeService } from '@/lib/api/employeeApi';
import EmployeeTable from './EmployeeTable';
import type { Employee } from '@/types/employee';
import ModalEmployeeForm from './ModalEmployeeForm';

export default function OwnerEmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSave = async (data: Omit<Employee, 'id' | 'schedule'>) => {
    try {
      if (selectedEmployee) {
        await employeeService.update(selectedEmployee.id, data);
      } else {
        await employeeService.create(data);
      }
      fetchEmployees();
      setOpenForm(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await employeeService.remove(id);
      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employee Management</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setSelectedEmployee(null);
            setOpenForm(true);
          }}
        >
          + Add Employee
        </button>
      </div>

      <EmployeeTable
        employees={employees}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ModalEmployeeForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
        defaultValues={selectedEmployee || undefined}
      />
    </div>
  );
}
