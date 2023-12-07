import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackComponent } from './modules/auth/callback/callback.component';


const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/dashboard" },
  {
    path: "",
    loadChildren: () =>
      import("./modules/auth/auth.module").then(
        (m) => m.AuthModule
      ),
  },
  {
    path: "",
    loadChildren: () =>
      import("./layouts/admin-layout/admin-layout.module").then(
        (m) => m.AdminLayoutModule
      ),
  },
  {
    path: "auth/callback",
    component:CallbackComponent
  },
  { path: "**", redirectTo: "404-not-found" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
