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
  active = "Active",
  inactive = "Inactive",
}

export enum Api_Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
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

export const formatID = (id: string): string => {
  if (id.length <= 7) return id;
  return `${id.substring(0, 5)}...${id.substring(id.length - 2)}`;
};
