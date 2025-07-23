"use client";

import { useEffect, useState } from "react";
import { employeeService } from "@/lib/api/employeeApi";
import EmployeeTable from "./EmployeeTable";
import type { Employee } from "@/types/employee";
import ModalEmployeeForm from "./ModalEmployeeForm";
import Pagination from "../ui/Pagination";
export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [openForm, setOpenForm] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to load employee list:", error);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeService.getAll(page, 10);
      setEmployees(res.data);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
  };

  fetchEmployees();
}, [page]);

  const handleSave = async (
    data: Omit<Employee, "id" | "schedule" | "tasks">,
    id?: string
  ) => {
    try {
      if (id && selectedEmployee) {
        const updates: Partial<Employee> = {};

        if (data.name !== selectedEmployee.name && data.name)
          updates.name = data.name;
        if (data.email !== selectedEmployee.email && data.email)
          updates.email = data.email;
        if (
          data.phoneNumber !== selectedEmployee.phoneNumber &&
          data.phoneNumber !== undefined
        )
          updates.phoneNumber = data.phoneNumber;
        if (data.role !== selectedEmployee.role && data.role)
          updates.role = data.role;
        if (
          data.department !== selectedEmployee.department &&
          data.department !== undefined
        )
          updates.department = data.department;
        if (
          data.status !== selectedEmployee.status &&
          data.status !== undefined
        )
          updates.status = data.status;
        if (Object.keys(updates).length > 0) {
          await employeeService.update(id, updates);
        } else {
          console.log("No changes detected, skipping update.");
        }
      } else {

        const createData: Omit<Employee, "id" | "schedule" | "tasks"> = {
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          role: data.role || "employee",
          status: data.status || "active",
          department: data.department || "",
        };
        await employeeService.create(createData);
      }

      await fetchEmployees();
      setOpenForm(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await employeeService.remove(id);
      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employee Management</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setSelectedEmployee(null);
            setOpenForm(true);
          }}
        >
          Add Employee
        </button>
      </div>
<>  <EmployeeTable
        employees={employees}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
     

      <ModalEmployeeForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedEmployee(null);
        }}
        onSave={handleSave}
        defaultValues={selectedEmployee || undefined}
        initialData={
          selectedEmployee
            ? {
                name: selectedEmployee.name,
                email: selectedEmployee.email,
                phoneNumber: selectedEmployee.phoneNumber || "",
                role: selectedEmployee.role,
                status: selectedEmployee.status,
                department: selectedEmployee.department || "",
              }
            : null
        }
      />
    </div>
  );
}
