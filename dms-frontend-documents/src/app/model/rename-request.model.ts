export class RenameRequest {
  file: string;
  name: string;

  constructor(file: string, name: string) {
    this.file = file;
    this.name = name;
  }
}
