import { Injectable } from '@angular/core';
import { AuthService } from 'app/modules/auth/auth.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import {io} from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  public isRefresh:Subject<any> = new Subject();
  constructor(private _authService:AuthService) {
    this.socket = io(environment.socketUrl + '?access_token='+this._authService?.getUser?.accessToken);
   }
  // connectSocket(){
    
  // }
  listen(eventName: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on(eventName, (data: any) => {
        observer.next(JSON.parse(data));
      });
    });
  }
  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }
}
