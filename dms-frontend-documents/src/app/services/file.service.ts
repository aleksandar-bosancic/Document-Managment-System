import {Injectable} from '@angular/core';
import {FileElement} from "../model/file-element";
import {v4 as uuid} from "uuid";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private map = new Map<string, FileElement>();
  public list: FileElement[] = [];

  constructor() {
    const root = new FileElement(uuid(), true, 'root', '');
    const folderA = new FileElement(uuid(), true, 'Folder A', root.id);
    const folderB = new FileElement(uuid(), true, 'Folder B', root.id);
    const folderC = new FileElement(uuid(), true, 'Folder C', folderA.id);
    const fileA = new FileElement(uuid(), false, 'FileElement A', root.id);
    const folderE = new FileElement(uuid(), true, 'Folder E', root.id);
    const folderD = new FileElement(uuid(), true, 'Folder D', folderC.id);
    folderA.children?.push(folderC);
    folderC.children?.push(folderD);
    root.children?.push(folderB, folderE, fileA, folderA);
    this.list.push(root, folderA, folderC, folderA, folderB, folderE, folderD, fileA);
  }

  add(folder: FileElement): FileElement {
    this.map.set(folder.id, folder);
    return folder;
  }

  delete(file: FileElement, parent: FileElement): void {
    let p = this.get(file.parent);
    let index = p?.children?.indexOf(file);
    if (index != undefined) {
      p?.children?.splice(index, 1);
    }
    if (file.isFolder){
      file.children?.forEach(value => this.delete(value, p!));
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
