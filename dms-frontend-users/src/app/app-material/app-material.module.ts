import { NgModule } from '@angular/core';
import {MatButtonModule} from "@angular/material/button";

const materialModules = [
  MatButtonModule
];

@NgModule({
  declarations: [],
  imports: [
    ...materialModules
  ],
  exports: [
    ...materialModules
  ],
})
export class AppMaterialModule { }
