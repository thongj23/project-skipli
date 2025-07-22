// app/employee-dashboard/page.tsx
'use client';

import { AuthProvider } from '@/context/AuthContext';
import TaskManagement from '@/components/Task/Employee/TaskManagement';

export default function TaskEmployeePage() {
  return (
    <AuthProvider role="employee">
      <TaskManagement />
    </AuthProvider>
  );
}
