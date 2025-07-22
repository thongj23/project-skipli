export interface User {
  id: string;
  uid?:string;
  email: string;
  phoneNumber: string;
  accessCode: string;
  role: 'manager' | 'employee';
}