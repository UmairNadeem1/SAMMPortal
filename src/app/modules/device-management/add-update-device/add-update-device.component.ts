import { Component, Inject, OnInit, Optional } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DeviceService } from "../device.service";
import { ToastrService } from "ngx-toastr";
import { LoaderService } from "app/modules/shared/loader/loader.service";
import { finalize } from "rxjs";
import { ResponseData } from "app/models/enum/request-type.enum";

@Component({
  selector: "app-add-update-device",
  templateUrl: "./add-update-device.component.html",
  styleUrls: ["./add-update-device.component.scss"],
})
export class AddUpdateDeviceComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) @Optional() public data: any,
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddUpdateDeviceComponent>,
    private deviceService: DeviceService,
    private toastr: ToastrService,
    public loaderService: LoaderService
  ) {}
  usersForm: FormGroup = new FormGroup({});
  ngOnInit(): void {
    this.userForm();
    if(this.data){
      this.usersForm.patchValue(this.data);
    }
  }
  userForm() {
    this.usersForm = this._formBuilder.group({
      device_id: [0],
      device_name: ["", [Validators.required]],
      device_serial: ["", [Validators.required]],
    });
  }
  onSubmit() {
    this.loaderService.isLoading = true;
    this.deviceService
      .AddUpdateDevice(this.usersForm.value)
      .pipe(
        finalize(() => {
          this.loaderService.isLoading = false;
        })
      )
      .subscribe((res: ResponseData<any>) => {
        if (res.success) {
          this.dialogRef.close(true);
          this.toastr.success(res.message, "Success");
        } else {
          this.toastr.error(res.message, "Error");
        }
      });
  }
  onClose(val) {
    this.dialogRef.close(val);
  }
}
