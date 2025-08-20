import { CheckerDecision } from './../../helpers/checker-decision';

export interface CreateUserCommand {
  email: string;
  corporateOrIndividualId?: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: UserType;
  roles: number[];
  permissions: string[];
}

export interface ChangeRolePermissionCommand {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  roles: number[];
  permissions: string[];
}

/* export interface UserApproveDeleteRequest {
  userId: string;
  action: number;
} */
export interface ApproveOrRejectChangeCommand {
  userId: string;
  checkerDecision: CheckerDecision;
}

export interface UserDeleteRequest {
  userId: string;
}

export interface UserResponse {
  id: string;
  entityIdMapTo: string;
  entityName: string;
  userName: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: number;
  status: string;
  userType: UserType,
  createdBy: string;
  createdAt: Date | null;
  updatedBy: string | null;
  updatedAt: Date | null;
  isLocked: boolean;
  failedLoginAttempts: number;
  lastLoginIp: string | null;
  lastLoginAttempt: Date | null;
}

export interface LoginRequest {
  userName: string;
  password: string;
  otp: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
export interface RoleResponse {
  roleId: number;
  roleName: string;
}

export enum UserRoles {
  TradeInitiator = 1,
  Verifier = 2,
  TradeAuthorizer = 3,
  TreasuryAuthorizer = 4,
  TreasuryOperationAuthorizer = 5,
  TradeOperationAuthorizer = 6,
  TradeDeskAuthorizer = 7,
  ViewOnly = 8,
  Admin = 9,
  SuperAdmin = 10,
}

export enum UserType {
  InternalUser = 1,
  ExternalUser = 2
}

export interface EntityIdLookupName {
  id: string;
  name: string;
}

export interface ChangePasswordCommand {
  userId: string;
  currentPassword: string;
  newPassword: string;
}
