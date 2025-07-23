"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Employee } from "@/types/employee";

type Props = {
  employees: Employee[];
  loading: boolean;
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
};

export default function EmployeeTable({ employees, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (employees.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No employees found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((emp) => {
          const isActive = !!emp.schedule;
          const statusText = isActive ? "Active" : "Inactive";
          const statusClass = isActive
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-600";

          return (
            <TableRow key={emp.id}>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>
                <span
                  className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${statusClass}`}
                >
                  {statusText}
                </span>
              </TableCell>
              <TableCell className="space-x-2">
                <Button variant="default" size="sm" onClick={() => onEdit(emp)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(emp.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
