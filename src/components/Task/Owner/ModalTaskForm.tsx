'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types/task';
import type { Employee } from '@/types/employee';

type FormData = Omit<Task, 'taskId'>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData, taskId?: string) => void;
  employees: Employee[];
  initialData?: FormData | null;
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
    employeeId: '',
    status: 'pending',
  });

  useEffect(() => {
    if (open) {
      setForm(
        initialData ?? {
          employeeId: '',
          status: 'pending',
        }
      );
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!form.employeeId) {
      alert('Vui lòng chọn nhân viên.');
      return;
    }
    onSave(form, defaultValues?.taskId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues?.taskId ? 'Sửa Task' : 'Tạo Task'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <select
            name="employeeId"
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Chọn nhân viên</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
          <select
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as 'pending' | 'completed' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="pending">Đang chờ</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button className="bg-blue-500 text-white" onClick={handleSubmit}>
            {defaultValues?.taskId ? 'Cập nhật' : 'Tạo'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}