
import { NgModule } from '@angular/core';
import { StoreFrontComponent } from './storeFront/storeFront.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path:'',component:StoreFrontComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreFrontRoutingModule { }
