import {Injectable} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {User} from "../model/user.model";
import {Attribute} from "../model/attribute.model";
import {UserPermissions} from "../model/user-permissions";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: any;
  public userPermissions: any;
  public isClient: boolean = true;
  public isAdmin: boolean = false;

  constructor(private keycloakService: KeycloakService) {
  }

  async getUser() {
    return await this.keycloakService.loadUserProfile().then((value: any) => {
      let attributes: Attribute = new Attribute(value.attributes.rootDirectory, value.attributes.allowedDomains, value.attributes.actions);
      this.user = new User(value.id, value.username, value.firstName, value.lastName, value.email, attributes);
      this.updatePermissions();
      return this.user;
    });
  }

  updatePermissions() {
    let userPermissions: UserPermissions;
    let download: boolean = false;
    let edit: boolean = false;
    let remove: boolean = false;
    let upload: boolean = false;
    if (this.keycloakService.getUserRoles().find(value => value === 'application-document-admin')) {
      this.isClient = false;
      userPermissions = new UserPermissions(true, true, true, true, true, true);
      this.userPermissions = userPermissions;
    } else if (this.keycloakService.getUserRoles().find(value => value === 'application-system-admin')){
      this.isClient = false;
      this.isAdmin = true;
      userPermissions = new UserPermissions(true, true, true, true, true, true);
      this.userPermissions = userPermissions;
    } else {
      this.isClient = true;
      let perms: string[] = this.user.attributes.actions;
      perms.forEach(value => {
        if (value === 'download') {
          download = true;
        } else if (value === 'edit') {
          edit = true;
        } else if (value === 'remove') {
          remove = true;
        } else if (value === 'upload') {
          upload = true;
        }
      });
      this.userPermissions = new UserPermissions(download, edit, remove, upload, false, false);
    }

  }

  logout() {
    this.keycloakService.logout().then();
  }
}
