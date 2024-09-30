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
