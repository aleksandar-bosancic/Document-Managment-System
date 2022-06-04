import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dms-frontend-documents';
  constructor(private http: HttpClient) {
  }
  fun() {
    console.log('asaa')
    this.http.get('http://localhost:9001/success').subscribe((value: any) => {
      console.log(value);
    })
  }
}
