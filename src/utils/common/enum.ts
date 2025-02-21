// we are going to use snake case with all capitals
// to use this import the object like here=>
//  import {Admin_Schema_Prompt_Messages} from "...path/common/enum"
// if (!user.firstName) {
//     errors.push(Admin_Schema_Prompt_Messages.FIRST_NAME_REQUIRED);
// }

export const Admin_Schema_Prompt_Messages = {
  FIRST_NAME_REQUIRED: "Please enter the first name",
  LAST_NAME_REQUIRED: "Please enter the last name",
  EMAIL_REQUIRED: "Email field can not be empty",
  VALID_MAIL: "Invalid mail",
  USERNAME_REQUIRED: "Please enter the username",
  PHONE_REQUIRED: "Please enter the phone number",
};
export enum AdminType {
  ADMIN = "Admin",
  SUPER_ADMIN = "Super_Admin",
}
export const Admin_Schema_Selecter = [
  { value: "Admin", label: "Admin" },
  { value: "Super_Admin", label: "Super Admin" },
];
export enum statusType {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum Api_Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}
export enum imageSize {
  maxImageSize = 2*1024*1024
}

export const Messages = {
  UPDATE_SUCCESS: (resource: string) =>
    `The ${resource} has been updated successfully.`,
  DELETE_SUCCESS: (resource: string) =>
    `The ${resource} has been deleted successfully.`,
  CREATE_SUCCESS: (resource: string) =>
    `The ${resource} has been created successfully.`,
  FETCH_ERROR: (resource: string) =>
    `Failed to fetch  ${resource} data. Please try again.`,
  DELETE_ERROR: (resource: string) =>
    `Failed to delete the ${resource}. Please try again.`,
  UPDATE_ERROR: (resource: string) =>
    `Failed to update the ${resource}. Please try again.`,
  ADD_ERROR: (resource: string) =>
    `Failed to add the ${resource}. Please try again.`,
  FILE_TYPE_ERROR:(resource:string)=>
    `Unsupported ${resource} type`
};

export const AccountOption =["ACTIVE", "INACTIVE", "PENDING"]; 

export const ProjectOption = ["ACTIVE", "PENDING","REJECTED"];

export const AdminOption = ["ACCEPT","REJECT","PENDING"];

export const formatID = (id: string): string => {
  if (id.length <= 7) return id;
  return `${id.substring(0, 5)}...${id.substring(id.length - 2)}`;
};



export enum HireDehixTalentStatusEnum {
  ADDED = 'ADDED',
  APPROVED = 'APPROVED',
  CLOSED = 'CLOSED',
  COMPLETED = 'COMPLETED',
};

export enum BusinessStatusEnum {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
  NOT_VERIFIED = 'NOT_VERIFIED',
};

export enum NotificationTypeEnum {
  BUSINESS = 'BUSINESS',
  FREELANCER = 'FREELANCER',
  BOTH = 'BOTH',
};
export enum NotificationStatusEnum {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
}

// Enum for Oracle Status
export enum OracleStatusEnum {
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  APPLICABLE = 'APPLICABLE',
  STOPPED = 'STOPPED',
};

// Enum for Bid Status
export enum BidstatusEnum {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PANEL = 'PANEL',
  INTERVIEW = 'INTERVIEW',
};

export enum DomainStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
};

export enum FreelancerStatusEnum {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  INACTIVE = 'INACTIVE',
  CLOSED = 'CLOSED',
};

export enum Type {
  FREELANCER = 'FREELANCER',
  ADMIN = 'ADMIN',
  BUSINESS = 'BUSINESS',
};

export enum TicketStatus {
  CREATED = 'CREATED',
  CLOSED = 'CLOSED',
  ACTIVE = 'ACTIVE',
};

export enum StatusEnum {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED ='COMPLETED',
};
export enum AdminPasswordStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
};
export enum AdminAccountStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
};
