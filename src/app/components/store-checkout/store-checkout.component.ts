import { Component, ElementRef, Inject, OnInit, Optional } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { LoaderService } from "app/modules/shared/loader/loader.service";
import {Stripe, loadStripe} from '@stripe/stripe-js';
import { environment } from "environments/environment";
import { StoreFrontService } from "app/modules/storeFront/storeFront.service";
import { finalize } from "rxjs";
import { ResponseData } from "app/models/enum/request-type.enum";
@Component({
  selector: "app-store-checkout",
  templateUrl: "./store-checkout.component.html",
  styleUrls: ["./store-checkout.component.scss"],
})
export class StoreCheckoutComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) @Optional() public data: any,
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<StoreCheckoutComponent>,
    private toastr: ToastrService,
    public loaderService: LoaderService,
    private _storeSerivce:StoreFrontService
  ) {}
  usersForm: FormGroup = new FormGroup({});
  stripe:Stripe;
  card:any;
  isError:boolean=false;
  ngOnInit(): void {
    this.stripeSetup();
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
  async stripeSetup(){
    this.stripe = await loadStripe(environment.stripe_publisher_key);
    const element = this.stripe.elements();
    this.card = element.create('card');
    // Add an instance of the card UI component into the `card-element`
    this.card.mount('#card-element');
    this.cardChange();
  }
  async createToken(){
    try {
      this.loaderService.isLoading = true;
      let result = await this.stripe.createToken(this.card);
      if(result.error){
        this.toastr.error(result.error.message,result.error.type);
        this.loaderService.isLoading = false;
        return;
      }
      this._storeSerivce.createOrder({
        recipe_ids : [...this.data.map((x)=>x.recipe_id)],
        token : result.token
      })
      .pipe(
        finalize(() => {
          this.loaderService.isLoading = false;
        })
      )
      .subscribe((resp:ResponseData<any>)=>{
        if(resp.success){
          this.toastr.success('Success',resp.message);
          this.onClose(true);
          localStorage.removeItem('CartData');
        }
        else{
          this.toastr.error('Error',resp.message);
        }
      })
    } catch (error) {
      this.loaderService.isLoading = false;
      this.toastr.error(error.message,'Payment Error');
    }
    
  }
  cardChange(){
    this.card.addEventListener('change',(event)=>{
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
        this.isError = true;
      } else {
        displayError.textContent = '';
        this.isError = false;
      }
    });
  }
}
