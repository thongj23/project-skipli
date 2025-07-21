export interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  department: string;
  schedule?: {
    days: string[];
    hours: string;
  };
}
export type FormData = Omit<Employee, 'id'>;