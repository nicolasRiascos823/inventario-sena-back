export interface UserModel {
  id: string;
  email: string;
  username: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  roleId: string;
  roleCode: string;
  createdAt: Date;
  updatedAt: Date;
}
