import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FileService} from "../../services/file.service";
import {FileElement} from "../../model/file-element.model";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.dialog.html',
  styleUrls: ['./file-upload.dialog.css']
})
export class FileUploadDialog implements OnInit {
  fileName: string = '';
  file?: File = undefined;
  public path: string = '';

  constructor(public dialogRef: MatDialogRef<FileUploadDialog>, private fileService: FileService) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    this.file = event.target?.files[0];
    if (this.file){
      this.fileName = this.file.name;
    }
  }

  fileSelected() {
    return !!this.fileName;
  }

  upload() {
    if (this.file) {
      this.fileService.uploadFile(this.file, this.path + this.fileName).subscribe(value => {
        let fileToReturn: FileElement = new FileElement(false, this.fileName);
        fileToReturn.path = this.path + this.fileName;
        this.dialogRef.close(fileToReturn);
      });
    }
  }
}
