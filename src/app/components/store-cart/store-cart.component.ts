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
  }
 
  onSubmit() {
   
  }
  onClose(val) {
    this.dialogRef.close(val);
  }

  removeData(index){
      let cart = JSON.parse(localStorage.getItem("CartData"))
      cart.splice(index,1);
      localStorage.setItem("CartData",JSON.stringify(cart));
  }

  getCartData(){
    return JSON.parse(localStorage.getItem("CartData"))
  }
}
