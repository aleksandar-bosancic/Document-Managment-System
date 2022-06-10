export class FileElement {
  folder: boolean;
  name: string;
  children?: Array<FileElement>;
  path?: string;

  constructor(isFolder: boolean, name: string) {
    this.folder = isFolder;
    this.name = name;
    if (isFolder) {
      this.children = new Array<FileElement>();
    }
  }
}
