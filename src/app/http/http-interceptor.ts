import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
  constructor(private toastr:ToastrService){}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let userinfo = JSON.parse(sessionStorage.getItem("UserInfo"))
    let access_token =  userinfo?.accessToken;
    if(!access_token){
      access_token = '';
    }
  
     const customReq = request.clone({
          setHeaders: {
            authorization: `bearer ${access_token}`,
            channel_id:'3'
          }
      });


    return next.handle(customReq).pipe(
      tap((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
 
        }
      }),
      catchError(response => {
        
        if (response instanceof HttpErrorResponse) {
        }
        if (response.message.includes('net::ERR_CONNECTION_REFUSED')) {
          this.toastr.error(response.message,"Error" );
          // You can handle this error as needed, e.g., display a user-friendly message.
        }

        return throwError(response);
      })
    );
  }
}
