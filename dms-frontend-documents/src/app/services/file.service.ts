import {Injectable} from '@angular/core';
import {FileElement} from "../model/file-element.model";
import {v4 as uuid} from "uuid";
import {HttpClient, HttpParams} from "@angular/common/http";
import {RenameRequest} from "../model/rename-request.model";
import {PathRequest} from "../model/path-request.model";
import {MoveRequest} from "../model/move-request.model";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  getAdminRoot(){
    return this.http.get('https://localhost:9000/admin/directory/root');
  }

  getFiles(userDir: string) {
    return this.http.get('https://localhost:9000/client/directory/root/' + userDir, {observe: 'response'});
  }

  add(folder: FileElement) {
    return this.http.post('https://localhost:9000/client/directory/add', folder);
  }

  delete(request: PathRequest) {
    return this.http.post('https://localhost:9000/client/directory/remove', request);
  }

  queryInFolder(folder: FileElement): FileElement[] {
    return folder?.children ?? [];
  }

  update(request: RenameRequest) {
    return this.http.post('https://localhost:9000/client/directory/update', request);
  }

  move(request: MoveRequest) {
    return this.http.post('https://localhost:9000/client/directory/move', request);
  }

  uploadFile(file: File, path: string) {
    let regex = /\//g;
    let params: HttpParams = new HttpParams().set('path', path.replace(regex, '#'));
    let formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post('https://localhost:9000/client/file/upload', formData, {
      reportProgress: true,
      responseType: "json",
      params: params
    });
  }

  downloadFile(file: FileElement) {
    let regex = /\//g;
    let params: HttpParams = new HttpParams().set('path', file.path!.replace(regex, '#'));

    return this.http.get('https://localhost:9000/client/file/download', {
      responseType: 'blob',
      params: params,
      observe: 'response'
    });
  }

  replaceFile(file: File, path: string) {
    let regex = /\//g;
    let params: HttpParams = new HttpParams().set('path', path.replace(regex, '#'));
    let formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post('https://localhost:9000/client/file/replace', formData, {
      reportProgress: true,
      responseType: "json",
      params: params
    });
  }
}
