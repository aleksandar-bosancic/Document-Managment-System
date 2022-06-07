import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import {AppMaterialModule} from "../app-material/app-material.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {KeycloakBearerInterceptor} from "keycloak-angular";


@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        AppMaterialModule,
        HttpClientModule
    ],
    exports: [
        HomeComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: KeycloakBearerInterceptor,
            multi: true
        }
    ]
})
export class HomeModule { }
