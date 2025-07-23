'use client';

import OwnerEmployeePage from '@/components/Employee/EmployeeManagement';
import { AuthProvider } from '@/context/AuthContext';
export default function OwnerDashboard() {

      <AuthProvider role="employee">
      <OwnerEmployeePage />
    </AuthProvider>
}
