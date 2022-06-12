import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FileService} from "../../services/file.service";
import {FileElement} from "../../model/file-element.model";
import {ReplaceFileDialog} from "../replace-file/replace-file.dialog";
import {PathRequest} from "../../model/path-request.model";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.dialog.html',
  styleUrls: ['./file-upload.dialog.css']
})
export class FileUploadDialog implements OnInit {
  public fileName: string = '';
  private file?: File = undefined;
  public path: string = '';
  public root: FileElement | undefined;
  private replace: boolean = false;
  public editPermission: boolean = false;

  constructor(public dialogRef: MatDialogRef<FileUploadDialog>, private fileService: FileService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    this.file = event.target?.files[0];
    if (this.file) {
      this.fileName = this.file.name;
      if (this.root?.children?.find(element => element.name === this.fileName)) {
        let ref = this.dialog.open(ReplaceFileDialog);
        ref.componentInstance.fileName = this.fileName;
        ref.afterClosed().subscribe((result: boolean) => {
          if (!result) {
            this.fileName = '';
            this.file = undefined;
          } else {
            if (!this.editPermission) {
              alert('No permission to replace file.');
              this.fileName = '';
              this.file = undefined;
            } else {
              this.replace = true;
            }
          }
        })
      }
    }
  }

  fileSelected() {
    return !!this.fileName;
  }

  upload() {
    if (this.file) {
      if (this.replace) {
        this.fileService.replaceFile(this.file, this.path + this.fileName).subscribe(value => {
          this.dialogRef.close('replaced');
        });
      } else {
        this.fileService.uploadFile(this.file, this.path + this.fileName).subscribe(value => {
          let fileToReturn: FileElement = new FileElement(false, this.fileName);
          fileToReturn.path = this.path + this.fileName;
          this.dialogRef.close(fileToReturn);
        });
      }
    }
  }
}
