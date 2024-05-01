import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../auth.service";
import { finalize } from "rxjs";
import { __assign } from "tslib";
import { LoaderService } from "app/modules/shared/loader/loader.service";
import { DomainUtills } from "app/utilities/domain/domain-utils";
import { ResponseData } from "app/models/enum/request-type.enum";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  signUpForm:FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private dialogRef: MatDialog,
    private toastr: ToastrService,
    private authService:AuthService,
    public loaderService: LoaderService,
    private route: ActivatedRoute
  ) {}
  
  private domainUtills = new DomainUtills();

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const message = params['message']; // Replace 'yourQueryParam' with your actual query parameter name
      if (message) {
        this.toastr.error(message,'Error');
      }
    });
    this.signInF()
  }

  signInF() {
    this.signUpForm = this._formBuilder.group({
      email: ["", [Validators.required]],
      user_password: ["", [Validators.required]],
      confirm_password: ["", [Validators.required]],
      full_name: ["", [Validators.required]],
      role_id: [3, [Validators.required]],
    });
  }

  onSubmit() {
    this.loaderService.isLoading = true;
    this.authService.Register(this.signUpForm.value)
    .pipe(
        finalize(() => {
           this.loaderService.isLoading = false
        })
    )
    .subscribe((res:ResponseData<any>) => {
        if (res.success === true) {
          // sessionStorage.setItem("UserInfo",JSON.stringify(res.data))
          this.toastr.success(res.message,'Success');
          this.router.navigateByUrl('/sign-in');
   
        } else { 
          this.toastr.error(res.message,'Failed');
           
        }
    });
  }   

  onGoogleSigninSuccess(){
    window.location.href = this.domainUtills.GetDomain() + 'auth/google?channel_id=3';
  }

}
