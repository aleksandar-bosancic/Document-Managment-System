export class UserPermissions {
  public download: boolean;
  public edit: boolean;
  public remove: boolean;
  public upload: boolean;
  public create: boolean;
  public move: boolean;


  constructor(download: boolean, edit: boolean, remove: boolean, upload: boolean, create: boolean, move: boolean) {
    this.download = download;
    this.edit = edit;
    this.remove = remove;
    this.upload = upload;
    this.create = create;
    this.move = move;
  }
}
