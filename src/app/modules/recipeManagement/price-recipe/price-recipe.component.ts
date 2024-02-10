import { Component, Inject, OnInit, Optional } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { LoaderService } from "app/modules/shared/loader/loader.service";
import { finalize } from "rxjs";
import { RecipeService } from "../recipe.service";

@Component({
  selector: "app-price-recipe",
  templateUrl: "./price-recipe.component.html",
  styleUrls: ["./price-recipe.component.scss"],
})
export class PriceRecipeComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) @Optional() public data: any,
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PriceRecipeComponent>,
    private recipeService:RecipeService,
    private toastr: ToastrService,
    public loaderService: LoaderService
  ) {}
  usersForm: FormGroup = new FormGroup({});
  ngOnInit(): void {
    this.userForm();
    if(this.data){
      // this.data.total_price = this.getTotalPriceForUpdate(this.data.total_price)
      this.usersForm.patchValue(this.data);
    }
  }
  userForm() {
    this.usersForm = this._formBuilder.group({
      recipe_id: [],
      total_price: ["", [Validators.required]],
    });
  }
  onSubmit() {
    this.loaderService.isLoading = true;
    let finalData=Object.assign({...this.usersForm.value})
    // finalData.total_price = this.getTotalPrice(finalData.total_price)
    this.recipeService.ListToShop(finalData)
    .pipe(
        finalize(() => {
          this.loaderService.isLoading = false;
        })
    )
    .subscribe((res) => {
        if (res.success === true) {
          // this.GetRecipe();
          this.onClose(true)
          this.toastr.success('Recipe Listed','Success');
        } else { 
          this.toastr.error('Something went wrong','Failed');
        }
    });
  }

  onClose(val) {
    this.dialogRef.close(val);
  }

  getTotalPrice(price=0){

    if(price){
      const percentageToAdd = 0.05 * Number(price);
     return Number(price) + percentageToAdd;
    }
    const percentageToAdd = 0.05 * Number(this.usersForm.get('total_price').value);
    return Number(this.usersForm.get('total_price').value) + percentageToAdd;
  }

  getTotalPriceForUpdate(price=0){
    if(price){
      const percentageToAdd = 0.05 * Number(price);
     return Number(price) - percentageToAdd;
    }
    return 0;
  }
}
