import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Document Management System';

  constructor(public authService: AuthService, private router: Router) {
  }

  logout() {
    this.authService.logout();
  }

  logs() {
    this.router.navigate(['logs']).then();
  }
}
