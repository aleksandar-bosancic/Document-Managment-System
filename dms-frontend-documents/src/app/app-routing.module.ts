import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./services/auth.guard";

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(module => module.HomeModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
