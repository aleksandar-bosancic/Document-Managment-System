import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-replace-file',
  templateUrl: './replace-file.dialog.html',
  styleUrls: ['./replace-file.dialog.css']
})
export class ReplaceFileDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<ReplaceFileDialog>) { }

  public fileName: string | undefined;

  ngOnInit(): void {
  }

  response(response: boolean) {
    this.dialogRef.close(response);
  }
}
