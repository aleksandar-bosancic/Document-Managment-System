export class Attribute {
  public rootDirectory: Array<String>;
  public allowedDomains: Array<String>;

  constructor(rootDirectory: Array<String>, allowedDomains: Array<String>) {
    this.rootDirectory = rootDirectory;
    this.allowedDomains = allowedDomains;
  }
}
