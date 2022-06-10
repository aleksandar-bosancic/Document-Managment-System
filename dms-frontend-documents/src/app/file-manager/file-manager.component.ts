import {Component, Input, OnInit} from '@angular/core';
import {MatMenuTrigger} from "@angular/material/menu";
import {HttpClient} from "@angular/common/http";
import {FileService} from "../services/file.service";
import {FileElement} from "../model/file-element";
import {v4 as uuid} from "uuid";
import {MatDialog} from "@angular/material/dialog";
import {RenameDialogComponent} from "../dialogs/rename-dialog/rename-dialog.component";

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {
  public columnsBreakpoint: number = 8;
  public files: FileElement[] = [];
  public fileInClipboard: any = null;
  public currentRoot: any = null;
  public rootFolder: any;
  public currentPath: string = '';
  public canNavigateUp: boolean = false;
  public rootFolderName: string = 'root';

  constructor(private http: HttpClient, private fileService: FileService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    const root = this.fileService.add(new FileElement(uuid(), true, 'root', ''));
    const folderA = this.fileService.add(new FileElement(uuid(), true, 'Folder A', root.id));
    const folderB = this.fileService.add(new FileElement(uuid(), true, 'Folder B', root.id));
    const folderC = this.fileService.add(new FileElement(uuid(), true, 'Folder C', folderA.id));
    const fileA = this.fileService.add(new FileElement(uuid(), false, 'FileElement A', root.id));
    const folderE = this.fileService.add(new FileElement(uuid(), true, 'Folder E', root.id));
    const folderD = this.fileService.add(new FileElement(uuid(), true, 'Folder D', folderC.id));
    folderA.children?.push(folderC);
    folderC.children?.push(folderD);
    root.children?.push(folderB, folderE, fileA, folderA);
    this.currentRoot = root;
    this.rootFolder = root;
    this.updateFileElementQuery();
  }

  testIt() {
    // this.http.get('https://localhost:9000/try', {responseType: "text"}).subscribe(value => console.log(value));
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
        if (temp){
          alert('Name already exists');
        } else {
          let tmp = this.fileService.add(new FileElement(uuid(), true, res, this.currentRoot.id));
          this.currentRoot.children.push(tmp);
          this.updateFileElementQuery();
        }
      }
    });
  }

  removeFile(file: FileElement): void {
    this.fileService.delete(file);
    this.updateFileElementQuery();
  }

  cutFile(file: FileElement): void {
    this.fileInClipboard = file;
  }

  pasteFile() {
    if (this.fileInClipboard) {
      this.fileService.move(this.fileInClipboard, this.currentRoot);
      this.fileInClipboard = null;
      this.updateFileElementQuery();
    }
  }

  renameFile(file: FileElement): void {
    let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.componentInstance.dialogTitle = 'Rename ' + (file.isFolder ? 'folder' : 'file');
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let temp = this.files.find(value => value.name === res);
        if (temp){
          alert('Name already exists');
        } else {
          this.fileService.update(file.id, {name: res});
          this.updateFileElementQuery();
        }
      }
    })
  }

  moveFile(file: FileElement, destinationFolder: FileElement): void {
    this.fileService.move(file, destinationFolder);
    this.updateFileElementQuery();
  }

  updateFileElementQuery(): void {
    this.files = this.fileService.queryInFolder(this.currentRoot);
  }

  navigate(file: FileElement): void {
    if (file.isFolder) {
      this.currentRoot = file;
      this.files = this.fileService.queryInFolder(file);
      this.currentPath = this.pushToPath(this.currentPath, file.name);
      this.canNavigateUp = true;
    }
  }

  pushToPath(path: string, folderName: string): string {
    let tempPath = path ? path : '';
    tempPath += `${folderName}/`;
    return tempPath;
  }

  popFromPath(path: string): string {
    let tempPath = path ? path : '';
    let split = tempPath.split('/');
    split.splice(split.length - 2, 1);
    tempPath = split.join('/');
    return tempPath;
  }

  navigateUp(): void {
    if (this.currentRoot === this.rootFolder) {
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else if (this.currentRoot.parent === this.rootFolder.id){
      this.currentRoot = this.rootFolder;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.canNavigateUp = true;
      this.currentRoot = this.fileService.get(this.currentRoot.parent);
      // console.log(this.currentRoot)
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  openFileMenu(event: MouseEvent, menuTrigger: MatMenuTrigger, file: FileElement) {
    event.preventDefault();
    menuTrigger.openMenu();
  }

  upload() {
    console.log('upload')
  }
}
