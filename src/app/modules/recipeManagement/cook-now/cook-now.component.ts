import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeviceService } from 'app/modules/device-management/device.service';
import { LoaderService } from 'app/modules/shared/loader/loader.service';
import { RecipeService } from '../recipe.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'app/modules/shared/socket/socket.service';
import { ResponseData } from 'app/models/enum/request-type.enum';
import { GetAllDevice } from 'app/models/devices/get-all-device';
import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-cook-now',
  templateUrl: './cook-now.component.html',
  styleUrls: ['./cook-now.component.scss']
})
export class CookNowComponent implements OnInit, OnDestroy {
  devices:GetAllDevice[] = [];
  cooking:any[] = [];
  isSkelteon:boolean =false;
  message:string = '';
  subscription:Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) @Optional() public data: any,
  private dialogRef: MatDialogRef<CookNowComponent>,
  private deviceService:DeviceService,
  public loaderService: LoaderService,
  private recipeService:RecipeService,
  private toastr: ToastrService,
  private _socketService:SocketService) { }

  ngOnInit(): void {
    this.GetDevice();
  }
  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
  GetDevice() {
    this.isSkelteon= true;
    this.deviceService
      .GetDevice({ page: 1, limit: 5 })
      .pipe(
        finalize(() => {
          this.isSkelteon= false;
        })
      )
      .subscribe((res:ResponseData<{result:GetAllDevice[],total_counts:number}>) => {
        console.log(res);
        if (res.success) {
          this.devices = res.data.result;
          // this._socketService.connectSocket();
          this.subscription = this._socketService.listen('device-status').subscribe((data)=>{
            let index = this.devices.findIndex((x)=>x.device_serial === data.serial_number);
            if(index>-1) this.devices[index].device_status = 'Connected';
            
          })
        } else {
          // this.toastr.error("Something went wrong", "Failed");
        }
      });
  }
  cookNow(){
    this.deviceService.cookNow({
      cooking_detail:[
        ...this.cooking
      ]
    }).subscribe((resp:ResponseData<any>)=>{
      if(resp.success){
        this.toastr.success('Cooking Started','Success')
        this.dialogRef.close(true);
        this._socketService.isRefresh.next(resp.data);
      }
      else{

      }
    })
  }
  onChange(event:any,row:GetAllDevice){
    if(event.target.checked){
      this.cooking.push({
        serial_number : row.serial_number,
        recipe_id : this.data.recipe_id
      })
    }
    else{
      let index = this.cooking.findIndex((x)=>x.serial_number == row.serial_number);
      if(index>-1) this.cooking.splice(index,1);
    }
  }

}
