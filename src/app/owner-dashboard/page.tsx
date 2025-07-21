'use client';

import Nav from '@/components/layout/Nav';
import { Button } from '@/components/ui/button';
import OwnerEmployeePage from '@/components/Employee/EmployeeManagement';

export default function OwnerDashboard() {
  return (
    <div className="flex h-screen">
      <Nav />
   <OwnerEmployeePage />
     
    </div>
  );
}
