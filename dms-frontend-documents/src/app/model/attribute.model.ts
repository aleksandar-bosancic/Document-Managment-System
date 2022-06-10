export class Attribute {
  public rootDirectory: Array<string>;
  public allowedDomains: Array<string>;
  public actions: Array<string>;

  constructor(rootDirectory: Array<string>, allowedDomains: Array<string>, actions: Array<string>) {
    this.rootDirectory = rootDirectory;
    this.allowedDomains = allowedDomains;
    this.actions = actions;
  }
}
