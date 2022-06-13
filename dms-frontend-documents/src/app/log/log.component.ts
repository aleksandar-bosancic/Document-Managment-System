import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LogUser} from "../model/log-user";
import {Log} from "../model/log.model";
import {DatePipe} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  public users: LogUser[] = [];
  public displayedColumns: string[] = ['username', 'action', 'fileName', 'time'];
  public dataSource: Log[] = [];

  constructor(private http: HttpClient, private datePipe: DatePipe, private router: Router) {
    http.get('https://localhost:8443/admin/realms/dms/users/').subscribe((result: any) => {
      this.users = result.map((element: any) => {
        return new LogUser(element.username);
      })
    })
  }

  ngOnInit(): void {

  }

  getLogs(user: LogUser) {
    this.http.get('https://localhost:9000/admin/get-logs/' + user.username).subscribe((result: any) => {
      this.dataSource = result.map((value: any) => {
        let time = this.datePipe.transform(value.time, 'yyyy-MM-dd hh-mm-ss');
        return new Log(time, value.username, value.action, value.fileName);
      })
    })
  }

  back() {
    this.router.navigate(['']).then();
  }
}
