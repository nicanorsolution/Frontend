import { CheckerDecision } from './../../helpers/checker-decision';

export interface CreateUserCommand {
  email: string;
  password: string;
  userType: UserType;
  roles: number[];
  permissions: string[];
}

export interface ChangeRolePermissionCommand {
  userId: string;
  roles: number[];
  permissions: string[];
}

export interface UserApproveDeleteRequest {
  userId: string;
  action: number;
}
export interface ApproveOrRejectChangeCommand {
  userId: string;
  checkerDecision: CheckerDecision;
}

export interface UserDeleteRequest {
  userId: string;
}

export interface UserResponse {
  id: string;
  userName: string;
  role: number;
  status: string;
  userType: UserType,
  createdBy: string;
  createdAt: Date | null;
  updatedBy: string | null;
  updatedAt: Date | null;
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
  ChannelUser = 2
}
