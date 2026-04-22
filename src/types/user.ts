export enum Role {
  User = 'user',
  Admin = 'admin',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}
