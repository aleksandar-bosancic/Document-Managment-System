import {Component, Input, OnInit} from '@angular/core';
import {MatMenuTrigger} from "@angular/material/menu";
import {HttpClient} from "@angular/common/http";
import {FileService} from "../services/file.service";
import {FileElement} from "../model/file-element.model";
import {MatDialog} from "@angular/material/dialog";
import {RenameDialogComponent} from "../dialogs/rename-dialog/rename-dialog.component";
import {AuthService} from "../services/auth.service";
import {User} from "../model/user.model";
import {RenameRequest} from "../model/rename-request.model";
import {PathRequest} from "../model/path-request.model";
import {MoveRequest} from "../model/move-request.model";
import {FileUploadDialog} from "../dialogs/file-upload/file-upload.dialog";
import {UserPermissions} from "../model/user-permissions";
import {LogService} from "../services/log.service";
import {Log} from "../model/log.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {
  public columnsBreakpoint: number = 8;

  public userPermissions: any;
  private user: any;

  public files: FileElement[] = [];
  public pathHistory: FileElement[] = [];

  public fileInClipboard: any = null;
  public parentOfCutFile: any = null;

  public currentRoot: any;
  public rootFolder: any;

  public currentPath: string = '';

  constructor(private http: HttpClient, private fileService: FileService, private dialog: MatDialog, private authService: AuthService,
              private logService: LogService, private router: Router) {
    this.userPermissions = new UserPermissions(false, false, false, false, false, false);
    this.authService.getUser().then((user: User) => {
      this.user = user;
      if (this.authService.isAdmin) {
        this.getFiles('root');
      } else {
        this.getFiles(user.attributes.rootDirectory[0])
      }
      this.userPermissions = this.authService.userPermissions;
    })
  }

  getFiles(userDir: string) {
    if (userDir === 'root') {
      this.fileService.getAdminRoot().subscribe((value: any) => {
        this.rootFolder = value;
        this.currentRoot = this.rootFolder;
        this.files = this.rootFolder.children;
        this.currentPath = 'root/';
      })
    } else {
      // @ts-ignore
      this.fileService.getFiles(userDir).subscribe((result: any) => {
        this.rootFolder = result.body;
        this.currentRoot = this.rootFolder;
        this.files = this.rootFolder.children!;
        this.currentPath = this.rootFolder.name + '/';
      }, (error: any) => {
        alert('Error:  ' + error.error.message);
        this.authService.logout();
        this.router.navigate(['']).then();
      })
    }
  }

  ngOnInit(): void {
    this.updateFileElementQuery();
  }

  resize(event: any) {
    // this.columnsBreakpoint = (event.target.innerWidth <= 400) ? 2 : 6;
    let width: number = event.target.innerWidth;
    if (width <= 200) {
      this.columnsBreakpoint = 1;
    } else if (width <= 400) {
      this.columnsBreakpoint = 2
    } else if (width <= 800) {
      this.columnsBreakpoint = 4;
    } else if (width <= 1200) {
      this.columnsBreakpoint = 6;
    } else if (width <= 1800) {
      this.columnsBreakpoint = 8;
    } else {
      this.columnsBreakpoint = 10;
    }
  }


  addFolder(): void {
    let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.componentInstance.dialogTitle = 'Add new folder';
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let temp = this.files.find(value => value.name === res);
        if (temp) {
          alert('Name already exists');
        } else {
          let tmp = new FileElement(true, res);
          tmp.path = ((this.currentPath) ? this.currentPath : this.rootFolder.name) + res;
          this.fileService.add(tmp).subscribe(value => {
            if (!this.currentRoot.children) {
              this.currentRoot.children = new Array<FileElement>();
            }
            this.currentRoot.children.push(tmp);
            this.updateFileElementQuery();
            this.logService.addLog(new Log(Date.now().toString(), this.user.username, 'add-folder', tmp.name));
          });
        }
      }
    });
  }

  removeFile(file: FileElement): void {
    if (file.folder && this.authService.isClient) {
      alert('Insufficient permissions to remove directory.');
      return;
    }
    this.fileService.delete(new PathRequest(file.path!)).subscribe(value => {
      let index = this.currentRoot?.children?.indexOf(file);
      if (index != undefined) {
        this.currentRoot?.children?.splice(index, 1);
      }
      this.logService.addLog(new Log(Date.now().toString(), this.user.username, 'remove-file', file.name));
      this.updateFileElementQuery();
    });
  }

  cutFile(file: FileElement): void {
    this.parentOfCutFile = this.currentRoot;
    this.fileInClipboard = file;
  }

  pasteFile() {
    if (this.fileInClipboard && this.parentOfCutFile) {
      this.fileService.move(new MoveRequest(this.fileInClipboard.path, this.currentRoot.path)).subscribe(value => {
        this.move(this.fileInClipboard, this.currentRoot, this.parentOfCutFile);
        this.fileInClipboard = null;
        this.parentOfCutFile = null;
        this.logService.addLog(new Log(Date.now().toString(), this.user.username, 'move-file', this.fileInClipboard.name));
        this.updateFileElementQuery();
      })
    }
  }

  moveFile(file: FileElement, destinationFolder: FileElement): void {
    this.fileService.move(new MoveRequest(file.path!, destinationFolder.path!)).subscribe(value => {
      this.move(file, destinationFolder, this.currentRoot);
      this.logService.addLog(new Log(Date.now().toString(), this.user.username, 'move-file', file.name));
      this.updateFileElementQuery();
    })
  }

  move(file: FileElement, destination: FileElement, parent: FileElement) {
    let index = parent?.children?.indexOf(file);
    if (index != undefined) {
      parent?.children?.splice(index, 1);
    }
    if (!destination.children) {
      destination.children = new Array<FileElement>();
    }
    destination.children?.push(file);
  }

  renameFile(file: FileElement): void {
    let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.componentInstance.dialogTitle = 'Rename ' + (file.folder ? 'folder' : 'file');
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let temp = this.files.find(value => value.name === res);
        if (temp) {
          alert('Name already exists');
        } else {
          this.fileService.update(new RenameRequest(file.path!, res)).subscribe(value => {
            file.name = res;
            this.logService.addLog(new Log(Date.now().toString(), this.user.username, 'rename-file', file.name));
          });
          this.updateFileElementQuery();
        }
      }
    })
  }

  updateFileElementQuery(): void {
    this.files = this.fileService.queryInFolder(this.currentRoot);
  }

  navigate(file: FileElement): void {
    if (file.folder) {
      this.pathHistory.push(this.currentRoot);
      this.currentRoot = file;
      this.files = this.fileService.queryInFolder(file);
      this.currentPath = this.pushToPath(this.currentPath, file.name);
    }
  }

  pushToPath(path: string, folderName: string): string {
    let rootName = this.rootFolder.name;
    // if (this.rootFolder.name === 'root'){
    //   rootName = '';
    // }
    let tempPath = path ? path : rootName + '/';
    tempPath += `${folderName}/`;
    return tempPath;
  }

  popFromPath(path: string): string {
    let rootName = this.rootFolder.name;
    if (this.rootFolder.name === 'root'){
      rootName = '';
    }
    let tempPath = path ? path : rootName + '/';
    let split = tempPath.split('/');
    split.splice(split.length - 2, 1);
    tempPath = split.join('/');
    return tempPath;
  }

  navigateUp(): void {
    if (this.pathHistory && this.pathHistory.length != 0) {
      this.currentRoot = this.pathHistory.pop();
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.rootFolder;
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  openFileMenu(event: MouseEvent, menuTrigger: MatMenuTrigger, file: FileElement) {
    event.preventDefault();
    menuTrigger.openMenu();
  }

  upload() {
    let dialogRef = this.dialog.open(FileUploadDialog);
    dialogRef.componentInstance.path = this.currentPath;
    dialogRef.componentInstance.root = this.currentRoot;
    dialogRef.componentInstance.editPermission = this.userPermissions.edit;
    dialogRef.afterClosed().subscribe(value => {
      if (!value) {
        return;
      }
      if (value === 'canceled') {
        return;
      }
      if (value === 'replaced') {
        return;
      }
      if (!this.currentRoot.children) {
        this.currentRoot.children = new Array<FileElement>();
      }
      this.currentRoot.children.push(value);
      this.logService.addLog(new Log(Date.now().toString(), this.user.username, 'upload-file', value.name));
      this.updateFileElementQuery();
    });
  }

  canNavigate() {
    return (this.pathHistory && this.pathHistory.length > 0);
  }

  downloadFile(file: FileElement): void {
    this.fileService.downloadFile(file).subscribe((response) => {
      let downloadedFile: any = response.body;
      let a = document.createElement('a');
      let url = URL.createObjectURL(downloadedFile)
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      this.logService.addLog(new Log(Date.now().toString(), this.user.username, 'move-file', file.name));
    });
  }

  canRemove(action: any) {
    if (this.userPermissions) {
      switch (action) {
        case 'remove':
          return this.userPermissions.remove;
        case 'edit':
          return this.userPermissions.edit;
        case 'download':
          return this.userPermissions.download;
        case 'upload':
          return this.userPermissions.upload;
        case 'create':
          return this.userPermissions.create;
        case 'move':
          return this.userPermissions.move;
      }
    }
  }
}
