import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import {FileElement} from "../model/file-element";

export interface IFileService {
  add(file: FileElement): FileElement;
  delete(id: string): void;
  update(id: string, update: Partial<FileElement>): void;
  queryInFolder(folderId: string): FileElement[];
  get(id: string): FileElement | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class FileService implements IFileService{
  private map = new Map<string, FileElement>();

  constructor() { }

  add(file: FileElement): FileElement {
    file.id = uuid();
    this.map.set(file.id, this.clone(file));
    return file;
  }

  delete(id: string): void {
    this.map.delete(id);
  }

  get(id: string): FileElement | undefined{
    return this.map.get(id);
  }

  private querySubject: FileElement[] | undefined;
  queryInFolder(folderId: string): FileElement[] {
    const result: FileElement[] = [];
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    });
    this.querySubject = result;
    return this.querySubject;
  }

  update(id: string, update: Partial<FileElement>) {
    let file = this.map.get(id);
    file = Object.assign(file, update);
    this.map.set(file.id, file);
  }

  clone(file: FileElement){
    return JSON.parse(JSON.stringify(file));
  }
}
