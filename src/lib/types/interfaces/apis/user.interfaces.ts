import { IMediaDataType } from "./image.interfaces";

// ============ User Interfaces ============
export interface IUserDataType {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  avatarMediaId: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isVerified: boolean;
  isBanned: boolean;
  isDeleted: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  avatarMedia: IMediaDataType | null;
  roleAssignments?: IUserRoleAssignmentDataType[];
}

// export interface IUserProfileDataType {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   username: string;
//   avatarMedia: IMediaDataType | null;
//   isEmailVerified: boolean;
//   isPhoneVerified: boolean;
//   //   addresses?: IAddressDataType[];
// }

export interface IUserRoleDataType {
  id: string;
  name: "ADMINISTRATOR" | "AGENCY" | "AGENCY" | "CLIENT";
  createdAt: string;
  updatedAt: string;
}

export interface IUserRoleAssignmentDataType {
  id: string;
  userId: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  role: IUserRoleDataType;
}

// ============ Auth Response Interfaces ============
export interface IUserDataWithAccessTokenType extends IUserDataType {
  accessToken: string;
}
