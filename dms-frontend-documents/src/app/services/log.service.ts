import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Log} from "../model/log.model";

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }

  public addLog(log: Log){
    this.http.post('https://localhost:9000/logs/add', log).subscribe();
  }

  public getLogs(username: any){
    return this.http.get('https://localhost:9000/admin/get-logs' + username);
  }
}
