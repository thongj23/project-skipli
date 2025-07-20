'use client';

import Nav from '@/app/components/Nav';
import { Button } from '@/app/components/ui/button';

const employees = [
  { name: 'Employee 1', email: '123@gmail.com', status: 'Active' },
  { name: 'Employee 2', email: '123@gmail.com', status: 'Active' },
  { name: 'Employee 3', email: '123@gmail.com', status: 'Active' },
  { name: 'Employee 4', email: '123@gmail.com', status: 'Active' },
];

export default function OwnerDashboard() {
  return (
    <div className="flex h-screen">
      <Nav />
      <div className="flex-1 p-6 bg-white overflow-auto">
        <h1 className="text-2xl font-semibold mb-6">Manage Employee</h1>

        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium">4 Employee</span>
          <div className="flex gap-2">
            <Button className="bg-blue-500 text-white">+ Create Employee</Button>
            <Button variant="outline">Filter</Button>
          </div>
        </div>

        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="p-3">{emp.name}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    {emp.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <Button className="bg-blue-500 text-white">Edit</Button>
                  <Button className="bg-red-500 text-white">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
