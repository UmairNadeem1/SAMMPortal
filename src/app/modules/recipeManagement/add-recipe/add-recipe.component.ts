import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subscription, finalize, pipe } from "rxjs";
import { RecipeService } from "../recipe.service";
import { LoaderService } from "app/modules/shared/loader/loader.service";
import { environment } from "environments/environment";
import { MatSelectChange } from "@angular/material/select";

@Component({
  selector: "app-add-recipe",
  templateUrl: "./add-recipe.component.html",
  styleUrls: ["./add-recipe.component.scss"],
})
export class AddRecipeComponent implements OnInit {
  selectedTime: any;
  recipeForm: FormGroup;
  private selectedFile: File;
  public avatarURL: any;
  visible: boolean=false;
  private routeSub : Subscription;
  id:any;
  Title="Add Recipe";
  edibleCounter:any;
  spicesCounter:any;

  AssignedTypeLov=[];

  TypeLov=[{heading:'B1',value:'B1',status:true},
    {heading:'B2',value:'B2',status:true},
    {heading:'B3',value:'B3',status:true},
    {heading:'B4',value:'B4',status:true},
    {heading:'B5',value:'B5',status:true},
    {heading:'B6',value:'B6',status:true},
    {heading:'B7',value:'B7',status:true},
    {heading:'B8',value:'B8',status:true},
    {heading:'S1',value:'S1',status:true},
    {heading:'S2',value:'S2',status:true},
    {heading:'S3',value:'S3',status:true},
    {heading:'S4',value:'S4',status:true},
    {heading:'S5',value:'S5',status:true},
    {heading:'S6',value:'S6',status:true},
    {heading:'S7',value:'S7',status:true}
  ]
  
  valueChange(event: MatSelectChange,index){
    debugger
    // @ts-ignore
    this.recipeForm.controls.ingrediants.controls[index].controls.ingrediant_type.disable();
    const indexToRemove = this.TypeLov.findIndex(item => item.heading === event.value);

    if (indexToRemove !== -1) {
      this.TypeLov.splice(indexToRemove, 1);}

    this.AssignedTypeLov.push({value:event.value})
  }

  selected(event: MatSelectChange){
console.log(event.value)
  }

  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private recipeService:RecipeService,
    public loaderService: LoaderService,
    private router: Router, 
  ) {}

  ngOnInit(): void {
    this.RecipeForm();
    this.loaderService.title = "Add Recipe"
    this.routeSub  = this.route.params.subscribe(params => {
      if(params['id']){
        this.loaderService.title = "Update Recipe"
        this.Title="Update Recipe"
        this.recipeForm.controls["recipe_id"].setValue(Number(params['id']));
        this.getIngrediants();
    }
    });   
  }

  removeImg(){
    this.avatarURL = null;
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        this.selectedFile = event.target.files[0];
        var Name = this.selectedFile.name.split('.').pop();
        if (Name != undefined) {
            if (Name.toLowerCase() == "jpg" || Name.toLowerCase() == "jpeg" || Name.toLowerCase() == "png") {
                var reader = new FileReader();

                reader.onload = (event: any) => {
                    this.avatarURL = event.target.result;
                    this.visible = false;
                }
                reader.readAsDataURL(this.selectedFile);
            } else {
                this.toastr.error("Only jpeg,jpg and png files are allowed");
                return;
            }
        }
    } else {
        this.visible = true;
    }
}

  UploadImage(){
    this.loaderService.isLoading = true;
    this.recipeService.UploadPic(this.recipeForm.get('recipe_id').value,this.selectedFile)
    .pipe(
        finalize(() => {
          this.loaderService.isLoading = false
        })
    )
    .subscribe((res) => {
        if (res.success === true) {
          // this.router.navigateByUrl('/recipeManagement');
          this.toastr.success("Recipe Added Successfully", "Success");
        } else { 
          this.toastr.error('Something went wrong','Failed');
           
        }
    });    
  }
  getIngrediants(){
    this.loaderService.isLoading = true;
    this.recipeService.GetIngrediantsByRecipeId(this.recipeForm.controls["recipe_id"].value)
    .pipe(
        finalize(() => {
          this.loaderService.isLoading = false
        })
    ).subscribe((res) => {
        if (res.success === true) { 
        //  this.recipeForm.patchValue(res.data);
        if(res.data.recipe_pic)
        this.avatarURL = res.data.recipe_pic;
         this.recipeForm.controls["recipe_id"].setValue(res.data.recipe_id);
         this.recipeForm.controls["recipe_name"].setValue(res.data.recipe_name);
         this.recipeForm.controls["recipe_temperature"].setValue(res.data.recipe_temperature);
         this.recipeForm.controls["recipe_description"].setValue(res.data.recipe_description);
         this.recipeForm.controls["recipe_type"].setValue(res.data.recipe_type);
         this.recipeForm.controls["total_price"].setValue(res.data.total_price);
         res.data.ingrediants.forEach(i => {
          this.ingrediants().push(this.newIngrediant(i.recipe_id,i.ingrediant_name,i.ingrediant_type,i.ingrediant_quantity,i.ingrediant_cooking_time,i.ingrediant_steering_type,i.ingrediant_time_type,i.ingrediant_temperature));
         });
          // this.toastr.success('Login Successfully','Success');
        } else { 
          this.toastr.error('Something went wrong','Failed');
           
        }
    });
  }

  isFormValid(){
   return !(this.recipeForm.valid && this.ingrediants().valid)
  }
  hasError(controlName: string, errorName: string): boolean {
    return false;
    // return this.recipeForm.controls[controlName].hasError(errorName);
  }

  FormArrayHasError(controlName: string, errorName: string,index): boolean {
    return false;
    // return ((this.ingrediants().at(index) as FormGroup).get(controlName)).hasError(errorName);
  }

  onSubmit() {
    // var edible=0;
    // var spice=0;
    // this.ingrediants().getRawValue().forEach(element => {
    //   if(element.ingrediant_type == '1'){
    //     edible++;
    //   }
    //   else if(element.ingrediant_type == '2'){
    //     spice++;
    //   }
    //   });
    //   if(edible>8){
    //     this.toastr.error("Maximum 8 edibles are allowed","Error")
    //     return;
    //   }
    //   if(spice>8){
    //     this.toastr.error("Maximum 8 spices are allowed","Error")
    //     return;
    //   }

    this.loaderService.isLoading = true;
    this.recipeService.AddUpdateRecipe(Object.assign({...this.recipeForm.value}))
    .pipe(
        finalize(() => {
          this.loaderService.isLoading = false
        })
    )
    .subscribe((res) => {
        if (res.success === true) {
          debugger
          // this.toastr.success("User Added Successfully", "Success");
          // this.toastr.success('Login Successfully','Success');
          this.recipeForm.controls["recipe_id"].setValue(res.data.recipe_id);
          // this.toastr.success("Updated Successfully", "Success");
          if (this.avatarURL.includes('base64')) {
            this.UploadImage();
          }else{
            // this.router.navigateByUrl('/recipeManagement');
            this.toastr.success("Updated Successfully", "Success");
          }
        } else { 
          this.toastr.error('Something went wrong','Failed');
           
        }
    });   
  }

  onClose() {
  //   this.dialogRef.close(true);
  }

// Dynamic Work
//   createform(){
//     this.featureForm = this._formBuilder.group({
//         Id:null,
//         MainIcon:null,
//         Headings: this._formBuilder.array([]),
//     });
// }

RecipeForm() {
  this.recipeForm = this._formBuilder.group({
    recipe_id: [0],
    total_price: ["",[Validators.required]],
    recipe_name: ["", [Validators.required]],
    recipe_type: ["", [Validators.required]],
    recipe_temperature: ["", [Validators.required]],
    recipe_description: ["", [Validators.required]],
    ingrediants: this._formBuilder.array([]),
  });
}

ingrediants(): FormArray {
    return this.recipeForm.get('ingrediants') as FormArray;
}

newIngrediant(recipe_id= null,ingrediant_name= null,ingrediant_type= null,ingrediant_quantity= null,ingrediant_cooking_time= null,ingrediant_steering_type= null,ingrediant_time_type=null,ingrediant_temperature=null): FormGroup {
  this.AssignedTypeLov.push(ingrediant_type);
  return this._formBuilder.group({
      ingrediant_name:[ingrediant_name, [Validators.required]],
      ingrediant_type: [ingrediant_type,[Validators.required]],
      ingrediant_quantity:[ingrediant_quantity, [Validators.required]],
      ingrediant_cooking_time:[ingrediant_cooking_time, [Validators.required]],
      ingrediant_steering_type:[ingrediant_steering_type, [Validators.required]],
      ingrediant_time_type:[ingrediant_time_type, [Validators.required]],

      ingrediant_temperature:[ingrediant_temperature, [Validators.required]],

    });
}

addIngrediants(val=null) {
  debugger
    // @ts-ignore
    if (this.recipeForm.controls.ingrediants.length == 16) {
        this.toastr.error("Maximum 16 Ingrediants are allowed", "Error")
        return;
    }

    if(this.AssignedTypeLov.includes(val)){
      this.toastr.error("Container already exists", "Error")
      return;
    }
    this.ingrediants().push(this.newIngrediant(null,null,val));
   
}

removeIngrediants(empIndex: number,val=null) {
  // this.TypeLov.push({heading:this.recipeForm.get('ingrediants').value[empIndex].ingrediant_type,value:this.recipeForm.get('ingrediants').value[empIndex].ingrediant_type,status:true})
  
    this.ingrediants().removeAt(empIndex);
    if(val){
    const indexToRemove = this.AssignedTypeLov.findIndex(item => item === val);

    if (indexToRemove !== -1) {
      this.AssignedTypeLov.splice(indexToRemove, 1);}}
    // if(this.ingrediants().getRawValue().at(3).ingrediant_type == '1')
    //   this.edibleCounter--;
    // else if(this.ingrediants().getRawValue().at(3).ingrediant_type == '2')
    // this.spicesCounter--;
  
    // this.imageUrl.splice(empIndex,1);
    // this.images.splice(empIndex,1);
}

// getLabel(index){
//   this.recipeForm.get('ingrediants').value[index].ingrediant_type
// }

getStyle(val){
  if(this.AssignedTypeLov.includes(val))
    {return "glass-effect card-icon bg-danger"}
 else{return "glass-effect card-icon"}
  
}

getStyle2(val){
  if(this.AssignedTypeLov.includes(val))
    {return "glass-effect bg-secondary bg-danger"}
 else{return "glass-effect bg-secondary"}
  
}


}



