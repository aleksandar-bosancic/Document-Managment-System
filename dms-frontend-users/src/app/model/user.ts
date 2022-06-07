import {Attribute} from "./attribute";

export class User {
  public id: string;
  public username: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public attributes: Attribute;


  constructor(id: string, username: string, firstName: string, lastName: string, email: string, attributes: Attribute) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.attributes = attributes;
  }
}
