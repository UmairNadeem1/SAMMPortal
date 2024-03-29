import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class HttpResponseHandler {
  constructor(
    private router: Router,
    private toastr: ToastrService,
  ) {}

  /**
   * Global http error handler.
   *
   * @param error
   * @param source
   * @returns {ErrorObservable}
   */
  public onCatch(response: any, source: Observable<any>): Observable<any> {
    switch (response.status) {
      case 400:
        this.handleBadRequest(response);
        break;

      case 401:
        this.handleUnauthorized(response);
        break;

      case 403:
        this.handleForbidden(response);
        break;

      case 404:
        this.handleNotFound(response);
        break;

      case 500:
        this.handleServerError(response);
        break;

      default:
        this.showNotificationError(response.statusText+response.status,response.error.message)
        break;
    }
    
    return throwError(response);
  }

  /**
   * Shows notification errors when server response status is 401
   *
   * @param error
   */
  private handleBadRequest(responseBody: any): void {
    this.showNotificationError(responseBody.statusText+responseBody.status,responseBody.error.message)
  }

  /**
   * Shows notification errors when server response status is 401 and redirects user to login page
   *
   * @param responseBody
   */
  private handleUnauthorized(responseBody: any): void {
    this.showNotificationError(responseBody.statusText+responseBody.status,responseBody.error.message)
    sessionStorage.clear()
    localStorage.clear()
    // logout
    this.router.navigate(['/sign-in']);
  }

  /**
   * Shows notification errors when server response status is 403
   */
  private handleForbidden(response): void {
    this.showNotificationError(response.statusText+response.status,response.error.message)
    this.router.navigate(['/sign-in']);
  }

  /**
   * Shows notification errors when server response status is 404
   *
   * @param responseBody
   */
  private handleNotFound(responseBody: any): void {
      this.showNotificationError(responseBody.statusText+responseBody.status,responseBody.error.message)
  }

  /**
   * Shows notification errors when server response status is 500
   */
  private handleServerError(response): void {
    this.showNotificationError(response.statusText+response.status,response.error.message)
  }

  /**
   * Parses server response and shows notification errors with translated messages
   *
   * @param response
   */
  private handleErrorMessages(response: any): void {
    if (!response) {
      return;
    }

    for (const key of Object.keys(response)) {
      if (Array.isArray(response[key])) {
        response[key].forEach((value:any) =>
          this.showNotificationError('Error', value)
        );
      } else {
        this.showNotificationError('Error',response[key]);
      }
    }
  }

  /**
   * Returns relative url from the absolute path
   *
   * @param responseBody
   * @returns {string}
   */
  private getRelativeUrl(url: string): string {
    return url.toLowerCase().replace(/^(?:\/\/|[^\/]+)*\//, '');
  }

  /**
   * Shows error notification with given title and message
   *
   * @param title
   * @param message
   */
  private showNotificationError(title: string, message: string): void {
    this.toastr.error(message,title);
  }
}
