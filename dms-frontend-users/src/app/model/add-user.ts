import {Attribute} from "./attribute";

export class AddUser {
  public username: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public realmRoles: Array<string>;
  public attributes: Attribute;


  constructor(username: string, firstName: string, lastName: string, email: string, realmRoles: Array<string>, attributes: Attribute) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.realmRoles = realmRoles;
    this.attributes = attributes;
  }
}
