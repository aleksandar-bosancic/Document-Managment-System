import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, private keycloakService: KeycloakService) { }

  ngOnInit(): void {

  }

  logout() {
    this.keycloakService.logout().then(() => this.keycloakService.clearToken());
  }

  testIt() {
    this.http.get('https://localhost:9000/test',{responseType: "text"}).subscribe(value => console.log(value));
  }
}
