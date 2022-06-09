export class FileElement {
  id: string;
  isFolder: boolean;
  name: string;
  parent: string;


  constructor(id: string, isFolder: boolean, name: string, parent: string) {
    this.id = id;
    this.isFolder = isFolder;
    this.name = name;
    this.parent = parent;
  }
}
