import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DeviceListingComponent } from "./device-listing/device-listing.component";
import { SharedModule } from "../shared/shared.module";
import { DeviceManagementRoutingModule } from "./device-routing.module";
import { MappedDevicesComponent } from './mapped-devices/mapped-devices.component';


@NgModule({
  declarations: [DeviceListingComponent, MappedDevicesComponent],
  imports: [CommonModule, SharedModule,DeviceManagementRoutingModule],
})
export class DeviceManagementModule {}
