import {Injectable} from '@angular/core';
import {KeycloakService} from "keycloak-angular";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private service: KeycloakService) {
  }

  public logout(): void {
    this.service.logout().then();
  }
}
