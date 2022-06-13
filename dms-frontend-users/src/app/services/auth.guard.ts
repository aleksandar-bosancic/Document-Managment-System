import { Injectable } from '@angular/core';
import {KeycloakAuthGuard, KeycloakService} from "keycloak-angular";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import KeycloakAuthorization from "keycloak-js/dist/keycloak-authz";
import {AccessDeniedComponent} from "../access-denied/access-denied.component";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url
      });
    }
    const requiredRoles = route.data['roles'];
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0){
      return true;
    }

    if (requiredRoles.every((role) => this.roles.includes(role))){
      return true;
    } else {
      this.router.navigate(['access-denied']).then();
      // await this.keycloak.logout('access-denied');
      return false;
    }
  }
}
