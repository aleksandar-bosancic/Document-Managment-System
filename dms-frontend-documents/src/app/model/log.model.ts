export class Log {
  time: any;
  username: any;
  action: any;
  fileName: any;

  constructor(time: any, username: string, action: string, fileName: string) {
    this.time = time;
    this.username = username;
    this.action = action;
    this.fileName = fileName;
  }
}
