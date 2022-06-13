import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./services/auth.guard";
import {FileManagerComponent} from "./file-manager/file-manager.component";
import {LogComponent} from "./log/log.component";
import {AccessDeniedComponent} from "./access-denied/access-denied.component";

const routes: Routes = [
  {
    path: '',
    component: FileManagerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'logs',
    component: LogComponent,
    canActivate: [AuthGuard],
    data: { roles: ['system-admin']}
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
