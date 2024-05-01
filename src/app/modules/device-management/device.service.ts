import { Injectable } from "@angular/core";
import { DataService } from "app/http/data.service";
import { REQUESTTYPE } from "app/models/enum/request-type.enum";

@Injectable({
  providedIn: "root",
})
export class DeviceService {
  constructor(private _dataService: DataService) {}

  GetDevice(obj: any) {
    return this._dataService.genericServiceCaller(
      REQUESTTYPE.POST,
      "device/get-all-devices",
      obj
    );
  }
  AddUpdateDevice(body: any) {
    return this._dataService.genericServiceCaller(
      REQUESTTYPE.POST,
      "device/add-update-device",
      body
    );
  }
  DeleteDevice(body: any) {
    return this._dataService.genericServiceCaller(
      REQUESTTYPE.POST,
      "device/delete-device",
      body
    );
  }
  GetMappedDevice(device_id:number) {
    return this._dataService.genericServiceCaller(
      REQUESTTYPE.GET,
      "device/mapped-devices/"+device_id
    );
  }
  cookNow(body:any) {
    return this._dataService.genericServiceCaller(
      REQUESTTYPE.POST,
      "recipe/cook-now",
      body
    );
  }
}
