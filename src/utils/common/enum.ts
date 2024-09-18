// we are going to use snake case with all capitals
// to use this import the object like here=>
//  import {Admin_Schema_Prompt_Messages} from "...path/common/enum"
// if (!user.firstName) {
//     errors.push(Admin_Schema_Prompt_Messages.FIRST_NAME_REQUIRED);
// }

export const Admin_Schema_Prompt_Messages = {
  FIRST_NAME_REQUIRED: "Please enter the first name",
  SECOND_NAME_REQUIRED: "Please enter the second name",
  EMAIL_REQUIRED: "Email field can not be empty",
  VALID_MAIL: "Invalid mail",
};

export enum Api_Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}
