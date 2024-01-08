import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DeviceService } from '../device.service';
import { GetAllDevice } from 'app/models/devices/get-all-device';
import { ResponseData } from 'app/models/enum/request-type.enum';
import { AuthService } from 'app/modules/auth/auth.service';
import { DeleteComponent } from 'app/modules/shared/delete/delete.component';
import { LoaderService } from 'app/modules/shared/loader/loader.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mapped-devices',
  templateUrl: './mapped-devices.component.html',
  styleUrls: ['./mapped-devices.component.scss']
})
export class MappedDevicesComponent implements OnInit {
  mappedDevicesList:any[] = [];
  user = this._authService.getUser;
  constructor(@Inject(MAT_DIALOG_DATA) @Optional() public data: GetAllDevice,
              private _deviceSerice:DeviceService,
              private _authService:AuthService,
              private dialog: MatDialog,
              public loaderService: LoaderService,
              private toastr: ToastrService) { }
  displayedColumns: string[] = [
    "user_name",
    "device_id",
    "device_name",
    "device_serial",
    "action",
  ];
  ngOnInit(): void {
    this.getMappedDevice();
  }
  getMappedDevice(){
    this.loaderService.isLoading = true;
    this._deviceSerice.GetMappedDevice(this.data.device_id)
    .pipe(finalize(()=>{
      this.loaderService.isLoading = false;
    }))
    .subscribe((resp:ResponseData<GetAllDevice[]>)=>{
      if(resp.success){
        this.mappedDevicesList = [...resp.data.filter((x)=>x.created_by!=this.user.user_id)];
      }
      else{
        this.mappedDevicesList = [];
      }
    })
  }
  onDelete(device: GetAllDevice) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: "24%",
      height: "auto",
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data === true) {
        this.loaderService.isLoading = true;
        this._deviceSerice
          .DeleteDevice({
            device_id:device.device_id,
            mapping_id:device.mapping_id
          })
          .pipe(
            finalize(() => {
              this.loaderService.isLoading = false;
            })
          )
          .subscribe((res:ResponseData<any>) => {
            if (res.success) {
              this.mappedDevicesList = this.mappedDevicesList.filter((x)=>x.device_id!=device.device_id);
              this.toastr.success(res.message, "Success");
            } else {
              this.toastr.error(res.message, "Failed");
            }
          });
      }
    });
  }
}
