import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'app/modules/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, 
              public jwtHelper: JwtHelperService,
              private _authService:AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin(state.url);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin(state.url);
  }


  async checkLogin(url: string): Promise<boolean> {
    const token = this._authService?.getUser?.accessToken;
    if (token) {
      var isExpired = this.jwtHelper.isTokenExpired(token);
      if (!isExpired) {
        return true;
      }
      else{
        this.router.navigate(['/sign-in'], { queryParams: { returnUrl: url } });
        return false;
      }
    }
    else{
      this.router.navigate(['/sign-in'], { queryParams: { returnUrl: url } });
      return false;
    }
  }

  
  getQueryParams(url: string) {
    let obj: any = {};
    let queryparams: any = url.split("?").pop();
    queryparams.split("&").forEach((x: any) => {
      obj[x.trim().split("=")[0]] = x.trim().split("=")[1]
    })
    return obj;

  }



}
