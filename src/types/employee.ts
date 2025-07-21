import { Task } from './task';
export interface Employee {
  id: string; 
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  status: 'active' | 'inactive';
  department?: string; 
  schedule?: { days?: string[]; hours?: string }
  tasks?: Task[]; 
}