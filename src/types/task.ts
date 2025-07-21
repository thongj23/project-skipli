export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; 
  status: TaskStatus;

  employeeId: string; 
}
export type FormData = {
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  employeeId: string;
  
};