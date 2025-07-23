'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Task } from '@/types/task';
import type { Employee } from '@/types/employee';

type FormData = Omit<Task, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData, taskId?: string) => void;
  employees: Employee[];
  initialData?: Task | null;
  defaultValues?: Task;
};

export default function ModalTaskForm({
  open,
  onClose,
  onSave,
  employees,
  initialData,
  defaultValues,
}: Props) {
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    dueDate: undefined,
    status: 'pending',
    employeeId: '',
  });

 useEffect(() => {
  if (open) {
    if (defaultValues) {
      const { title, description, dueDate, status, employeeId } = defaultValues;

      const validEmployeeId = employees.find(emp => emp.employeeId === employeeId)?.employeeId || '';
      setForm({
        title,
        description,
        dueDate,
        status,
        employeeId: validEmployeeId,
      });
    } else {
      setForm({
        title: '',
        description: '',
        dueDate: undefined,
        status: 'pending',
        employeeId: '',
      });
    }
  }
}, [open, defaultValues, employees]);

  const handleSubmit = () => {
    console.log('Dữ liệu form:', form);
    console.log('Gửi employeeId:', form.employeeId);
   
    if (!form.title.trim()) {
      alert('Title');
      return;
    }
    if (!form.employeeId || !employees.find((emp) => emp.employeeId === form.employeeId)) {
      alert('Employee!.');
      return;
    }

    onSave(form, defaultValues?.id);
    onClose();
  };



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues?.id ? 'Update task' : 'create task'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Title task"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="des"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
          <input
            type="date"
            value={form.dueDate ? new Date(form.dueDate).toISOString().split('T')[0] : ''}
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Task['status'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="pending">pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">complete</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            cancel
          </Button>
          <Button className="bg-blue-500 text-white" onClick={handleSubmit}>
            {defaultValues?.id ? 'Update' : 'create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}