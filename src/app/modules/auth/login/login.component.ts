import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomainUtills } from "app/utilities/domain/domain-utils";
import { LoaderService } from "app/modules/shared/loader/loader.service";
import { AuthService } from "../auth.service";
import { finalize } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  selectedTime: any;
  signInForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService:AuthService,
    public loaderService: LoaderService,
    private route: ActivatedRoute
  ) {
    // sessionStorage.clear();
  }
  private domainUtills = new DomainUtills();
  ngOnInit(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.route.queryParams.subscribe(params => {
      const message = params['message']; // Replace 'yourQueryParam' with your actual query parameter name
      if (message) {
        this.toastr.error(message,'Error');
      }
    });
    this.signInF();
  }

  onGoogleSigninSuccess(){
    window.location.href = this.domainUtills.GetDomain() + 'auth/google?channel_id=3';
  }

  signInF() {
    this.signInForm = this._formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  onSubmit() {
    this.loaderService.isLoading = true;
    this.authService.login(this.signInForm.value)
    .pipe(
        finalize(() => {
           this.loaderService.isLoading = false
        })
    )
    .subscribe((res) => {
        if (res.success === true) {
          sessionStorage.setItem("UserInfo",JSON.stringify(res.data))
          this.toastr.success('Login Successfully','Success');
          this.router.navigateByUrl('/dashboard');
   
        } else { 
          this.toastr.error(res.message,'Failed');
           
        }
    });
   
    // const dialogRef = this.dialog.open(OtpComponent, {
    //   width: "25%",
    //   height: "auto",
    // });

    // dialogRef.afterClosed().subscribe((data) => {
    //   if (data) {
    //     console.log(data);
    //   }
    // });
  }
}
