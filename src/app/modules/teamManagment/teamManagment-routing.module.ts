
import { NgModule } from '@angular/core';
import { TeamManagmentComponent } from './teamManagment/teamManagment.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path:'',component:TeamManagmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamManagmentRoutingModule { }
