import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private service: KeycloakService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  logout() {
    this.service.logout().then(this.service.clearToken);
  }

  testing() {
    this.http.get('https://localhost:9001/test', {responseType: "text"}).subscribe(value => console.log(value));
  }
}
