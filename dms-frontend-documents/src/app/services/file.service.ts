import {Injectable} from '@angular/core';
import {FileElement} from "../model/file-element";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private map = new Map<string, FileElement>();

  constructor() {
  }

  add(folder: FileElement): FileElement {
    this.map.set(folder.id, folder);
    return folder;
  }

  delete(file: FileElement): void {
    let parent = this.get(file.parent);
    let index = parent?.children?.indexOf(file);
    if (index != undefined) {
      parent?.children?.splice(index, 1);
    }
    if (file.isFolder){
      file.children?.forEach(value => this.delete(value));
    }
    this.map.delete(file.id);
  }

  get(id: string): FileElement | undefined {
    return this.map.get(id);
  }

  queryInFolder(folderId: FileElement): FileElement[] {
    return folderId.children ?? [];
  }

  update(id: string, update: Partial<FileElement>): void {
    let file = this.map.get(id);
    file = Object.assign(file, update);
    this.map.set(file.id, file);
  }

  move(file: FileElement, destination: FileElement): void {
    let parent = this.get(file.parent);
    let index = parent?.children?.indexOf(file);
    if (index != undefined) {
      console.log(index)
      parent?.children?.splice(index, 1);
    }
    console.log(parent?.children)
    destination.children?.push(file);
    console.log(destination.children)
    file.parent = destination.id;
  }
}
