export interface User {
  uid: string;
  email: string;
  phoneNumber: string;
  accessCode: string;
  role: 'manager' | 'employee';
}