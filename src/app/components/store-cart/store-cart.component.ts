import { Component, Inject, OnInit, Optional } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { LoaderService } from "app/modules/shared/loader/loader.service";
import { Cart } from "app/models/cart/cart";

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
  get total_price():number{
    return this.cart.reduce((pV,cV)=>pV+Number(cV.total_price),0)
  }
  removeData(recipe_id){
      this.cart = this.cart.filter((x)=>x.recipe_id != recipe_id);
  }

  get cart():Cart[]{
    return JSON.parse(localStorage.getItem("CartData"))
  }
  set cart(data:Cart[]){
    localStorage.setItem("CartData",JSON.stringify(data));
  }
}
