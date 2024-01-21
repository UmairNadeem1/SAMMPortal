import { Component, Inject, OnInit, Optional } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { LoaderService } from "app/modules/shared/loader/loader.service";

@Component({
  selector: "app-store-cart",
  templateUrl: "./store-cart.component.html",
  styleUrls: ["./store-cart.component.scss"],
})
export class StoreCartComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) @Optional() public data: any,
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<StoreCartComponent>,
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
   
  }
  onClose(val) {
    this.dialogRef.close(val);
  }
}
