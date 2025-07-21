'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';

type FormData = Omit<Employee, 'id' | 'schedule'>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  initialData?: FormData | null;
    defaultValues?: Employee;
};

export default function ModalEmployeeForm({ open, onClose, onSave, initialData }: Props) {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'employee',
    department: '',
  });

  useEffect(() => {
    if (initialData) {
    setForm({ ...initialData, role: 'employee' });
  }
    else {
      setForm({
        name: '',
        email: '',
        phoneNumber: '',
        role: 'employee',
        department: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Employee' : 'Create Employee'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} />
          <Input name="role" placeholder="Role" value={form.role} readOnly onChange={handleChange} />
          <Input name="department" placeholder="Department" value={form.department} onChange={handleChange} />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-blue-500 text-white" onClick={handleSubmit}>
            {initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
