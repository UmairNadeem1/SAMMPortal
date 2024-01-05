import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DeviceListingComponent } from "./device-listing/device-listing.component";

const routes: Routes = [
  {
    path: "",
    component: DeviceListingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceManagementRoutingModule {}
