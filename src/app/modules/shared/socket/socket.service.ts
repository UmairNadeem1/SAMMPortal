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
    if(!this.socket) this.socket = io(environment.socketUrl + `?access_token=${this._authService?.getUser?.accessToken}&channel_id=${'3'}`, {
      reconnection: true,
      reconnectionAttempts: 5,  // Try 5 times before giving up
      timeout: 10000,           // Timeout connection attempt after 10 seconds
    });
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
