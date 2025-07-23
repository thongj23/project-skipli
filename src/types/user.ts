export interface User {
  id: string;
  uid?:string;
  name:string;
  email: string;
  phoneNumber: string;
  accessCode: string;
  role: 'manager' | 'employee';
}