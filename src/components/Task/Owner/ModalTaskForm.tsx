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
      if (initialData) {
        const { title, description, dueDate, status, employeeId } = initialData;
        setForm({ title, description, dueDate, status, employeeId });
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
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!form.employeeId || !form.title.trim()) {
      alert('Please enter a title and select an employee.');
      return;
    }

    onSave(form, defaultValues?.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues?.id ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Detailed description"
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
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Task['status'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-500 text-white" onClick={handleSubmit}>
            {defaultValues?.id ? 'Update' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
