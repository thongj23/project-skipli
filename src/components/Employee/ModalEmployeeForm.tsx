'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';

type FormData = Omit<Employee, 'id' | 'schedule' | 'tasks'> & {
  status: 'active' | 'inactive';
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData, id?: string) => void;
  initialData?: FormData | null;
  defaultValues?: Employee;
};

export default function ModalEmployeeForm({
  open,
  onClose,
  onSave,
  initialData,
  defaultValues,
}: Props) {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'employee',
    department: '',
    status: 'active',
  });

  useEffect(() => {
    if (open) {
      setForm(
        initialData ?? {
          name: '',
          email: '',
          phoneNumber: '',
          role: 'employee',
          department: '',
          status: 'active',
        }
      );
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email) {
      alert('Please enter both name and email.');
      return;
    }
    onSave(form, defaultValues?.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues?.id ? 'Edit Employee' : 'Create Employee'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
          />
          <Input
            name="role"
            placeholder="Role"
            value={form.role}
            readOnly
            onChange={handleChange}
          />
          <select
            name="department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="Sale">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">Human Resources</option>
            <option value="Customer Support">Customer Support</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
