import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddUpdateDeviceComponent } from "./add-update-device/add-update-device.component";
import { DeviceListingComponent } from "./device-listing/device-listing.component";
import { SharedModule } from "../shared/shared.module";
import { DeviceManagementRoutingModule } from "./device-routing.module";


@NgModule({
  declarations: [AddUpdateDeviceComponent, DeviceListingComponent],
  imports: [CommonModule, SharedModule,DeviceManagementRoutingModule],
})
export class DeviceManagementModule {}
