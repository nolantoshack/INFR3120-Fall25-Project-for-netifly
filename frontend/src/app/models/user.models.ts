export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'Driver' | 'Dispatcher' | 'Admin';
}