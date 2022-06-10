export class MoveRequest {
  filePath: string;
  moveToPath: string;

  constructor(filePath: string, moveToPath: string) {
    this.filePath = filePath;
    this.moveToPath = moveToPath;
  }
}
