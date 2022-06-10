import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {initializeKeycloak} from "./config/keycloak-init";
import {KeycloakAngularModule, KeycloakBearerInterceptor, KeycloakService} from "keycloak-angular";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import {AppMaterialModule} from "./app-material/app-material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { RenameDialogComponent } from './dialogs/rename-dialog/rename-dialog.component';
import { FileUploadDialog } from './dialogs/file-upload/file-upload.dialog';


@NgModule({
  declarations: [
    AppComponent,
    FileManagerComponent,
    RenameDialogComponent,
    FileUploadDialog
  ],
  imports: [
    BrowserModule,
    AppMaterialModule,
    AppRoutingModule,
    KeycloakAngularModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
