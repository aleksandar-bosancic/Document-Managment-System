import {Injectable} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {User} from "../model/user.model";
import {Attribute} from "../model/attribute.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: any;

  constructor(private keycloakService: KeycloakService) {
  }

  async getUser() {
    return await this.keycloakService.loadUserProfile().then((value: any) => {
      let attributes: Attribute = new Attribute(value.attributes.rootDirectory, value.attributes.allowedDomains, value.attributes.actions);
      this.user = new User(value.id, value.username, value.firstName, value.lastName, value.email, attributes);
      return this.user;
    });
  }

  logout() {
    this.keycloakService.logout().then();
  }
}
